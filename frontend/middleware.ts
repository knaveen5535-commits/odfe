import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/self-order', '/customer-display', '/forbidden'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const role = request.cookies.get('userRole')?.value || '';
  const { pathname } = request.nextUrl;

  // 1. Landing page logic
  if (pathname === '/') {
    if (token) {
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard', request.url));
      if (role === 'CASHIER' || role === 'order_manager') return NextResponse.redirect(new URL('/pos', request.url));
      if (role === 'KITCHEN_STAFF') return NextResponse.redirect(new URL('/kitchen', request.url));
      if (role === 'billing') return NextResponse.redirect(new URL('/payments', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Allow public routes
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url)); // Handled by landing redirect
    }
    return NextResponse.next();
  }

  // 3. Enforce authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Enforce RBAC (Route Access Restrictions based on Master Prompt)
  
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/reports') || pathname.startsWith('/employees') || pathname.startsWith('/settings');
  const isPos = pathname.startsWith('/pos') || pathname.startsWith('/tables');
  const isKitchen = pathname.startsWith('/kitchen');
  const isPayments = pathname.startsWith('/payments');

  if (role === 'ADMIN') {
    if (isPos || isKitchen || isPayments) return NextResponse.redirect(new URL('/forbidden', request.url));
  } 
  else if (role === 'CASHIER' || role === 'order_manager') {
    if (isDashboard || isKitchen) return NextResponse.redirect(new URL('/forbidden', request.url));
  }
  else if (role === 'KITCHEN_STAFF') {
    if (isDashboard || isPos || isPayments || pathname.startsWith('/products') || pathname.startsWith('/customers')) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  else if (role === 'billing') {
    if (isDashboard || isPos || isKitchen || pathname.startsWith('/products')) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
