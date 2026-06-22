import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/self-order', '/customer-display', '/reset-password', '/forbidden'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
