

const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';


export async function login(email, password, rememberMe = false) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
    credentials: 'include',
  });
  const data = await res.json();
  console.log(data);
  
  if (!data.success) throw new Error(data.message );
  return data;
}

export async function register({ first_name, last_name, email, password }) {
  const res = await fetch(`${API_URL}/api/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, password }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message );

  return data;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message );
  return data;
}

export async function changePassword(email, newPassword) {
  const res = await fetch(`${API_URL}/api/users/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message );
  return data;
}

export async function logout() {
  try {
    await fetch(`${API_URL}/api/users/logout`, 
      { method: 'POST',
      credentials: 'include' 
    });
  } catch {
    throw new Error('Failed to logout');
  }
}
