import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/self-order', '/customer-display', '/forbidden'];

const publicRoutePrefixes = publicRoutes;

const roleRedirects: Record<string, string> = {
  ADMIN: '/dashboard',
  CASHIER: '/pos',
  KITCHEN: '/kitchen',
  KITCHEN_STAFF: '/kitchen',
  ORDER_MANAGER: '/orders',
  order_manager: '/orders',
};

function normalizeRole(role: string): string {
  if (role === 'KITCHEN_STAFF') return 'KITCHEN';
  if (role === 'ORDER_MANAGER' || role === 'order_manager') return 'CASHIER';
  return role;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isValidToken(token: string): boolean {
  if (!token || token === 'mock-jwt-token') return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const exp = payload.exp as number;
  if (exp && Date.now() >= exp * 1000) return false;
  return true;
}

const adminAllowed = ['/dashboard', '/products', '/categories', '/employees', '/customers', '/orders', '/reports', '/settings', '/floors', '/tables', '/bookings', '/coupons', '/promotions', '/inventory', '/analytics', '/profile', '/payment-methods'];
const cashierAllowed = ['/pos', '/orders', '/customers', '/tables', '/floor-plan', '/split-bill', '/coupons', '/checkout', '/receipt', '/payments', '/payment-history'];
const kitchenAllowed = ['/kitchen'];

function isRouteAllowed(pathname: string, allowedPrefixes: string[]): boolean {
  return allowedPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'));
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
  response.cookies.set('userRole', '', { path: '/', maxAge: 0 });
}

export function middleware(request: NextRequest) {
  const rawToken = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const rawRole = request.cookies.get('userRole')?.value || '';
  const role = normalizeRole(rawRole);
  const { pathname } = request.nextUrl;

  const validToken = isValidToken(rawToken || '');

  // 1. Public / pass-through routes — no auth required, no auth redirect
  if (pathname === '/' || publicRoutePrefixes.some(r => pathname.startsWith(r))) {
    if (pathname === '/login' || pathname === '/signup') {
      if (validToken && role) {
        const redirect = roleRedirects[role];
        return NextResponse.redirect(new URL(redirect || '/dashboard', request.url));
      }
    }
    const res = NextResponse.next();
    if (rawToken && !validToken) clearAuthCookies(res);
    return res;
  }

  // 2. Require authentication — redirect unauthenticated or invalid token
  if (!validToken) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    if (rawToken && !validToken) clearAuthCookies(res);
    return res;
  }

  // 3. Role-based route access — rewrite to forbidden for unauthorized roles
  switch (role) {
    case 'ADMIN':
      if (!isRouteAllowed(pathname, adminAllowed)) {
        return NextResponse.rewrite(new URL('/forbidden', request.url));
      }
      break;
    case 'CASHIER':
      if (!isRouteAllowed(pathname, cashierAllowed)) {
        return NextResponse.rewrite(new URL('/forbidden', request.url));
      }
      break;
    case 'KITCHEN':
      if (!isRouteAllowed(pathname, kitchenAllowed)) {
        return NextResponse.rewrite(new URL('/forbidden', request.url));
      }
      break;
    default:
      return NextResponse.rewrite(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
