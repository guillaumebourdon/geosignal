import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host');

  // Redirect geo-bnp.ccmperformance.com root to /audit-bnp
  if (hostname === 'geo-bnp.ccmperformance.com' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/audit-bnp', request.url));
  }

  return NextResponse.next();
}
