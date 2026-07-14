'use server';

import { cookies } from 'next/headers';
import { getServerHeaders } from './cookies';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7050';

const isProduction = process.env.NODE_ENV === 'production';

async function saveTokenCookie(token, rememberMe = false) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
  const cookieStore = await cookies();

  cookieStore.set('token', token, {
    httpOnly: isProduction,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge,
    path: '/',
  });
}

async function clearTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function login(email, password, rememberMe = false) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
  });
  const data = await res.json();

  if (!data.success) throw new Error(data.message);

  const token = data.data?.token;
  if (token) await saveTokenCookie(token, rememberMe);

  return data;
}

export async function register({ first_name, last_name, email, password }) {
  const res = await fetch(`${API_URL}/api/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, password }),
  });
  const data = await res.json();

  if (!data.success) throw new Error(data.message);

  const token = data.data?.token;
  if (token) await saveTokenCookie(token, false);

  return data;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function changePassword(email, newPassword) {
  const res = await fetch(`${API_URL}/api/users/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);

  await clearTokenCookie();
  return data;
}

export async function logout() {
  try {
    await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      headers: await getServerHeaders(),
    });
  } catch {
    throw new Error('Failed to logout');
  }

  await clearTokenCookie();
}
