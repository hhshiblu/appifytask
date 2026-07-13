'use server';

import { getServerHeaders } from './cookies';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: await getServerHeaders({ 'Content-Type': 'application/json' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.data.message );
    return data.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
