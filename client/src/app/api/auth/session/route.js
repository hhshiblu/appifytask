import { cookies } from 'next/headers';

export async function POST(request) {
  const { token, remember_me: rememberMe } = await request.json();

  if (!token) {
    return Response.json({ success: false, message: 'Token required' }, { status: 400 });
  }

  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  return Response.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return Response.json({ success: true });
}
