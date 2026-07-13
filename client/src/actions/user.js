
const API_URL = process.env.NEXT_PUBLIC_API_URL ||process.env.API_URL || 'http://localhost:4000';

export async function getCurrentUser() {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
  } catch {
    return null;
  }
}