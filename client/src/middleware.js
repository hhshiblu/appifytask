import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = ['/feed'];
const AUTH_ROUTES = ['/login', '/registration'];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(token) {
  if (!token) return false;

  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return !!payload?.id;
  } catch {
    return false;
  }
}

function redirectWithClearedToken(url) {
  const response = NextResponse.redirect(url);
  response.cookies.delete('token');
  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const authenticated = await isAuthenticated(token);

  if (isProtected && !authenticated) {
    return redirectWithClearedToken(new URL('/login', request.url));
  }

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*', '/login', '/registration'],
};
