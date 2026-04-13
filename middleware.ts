import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /crm routes (except login and API)
  if (pathname.startsWith('/crm') && !pathname.startsWith('/crm/login') && !pathname.startsWith('/api/')) {
    const session = request.cookies.get('crm_session')
    if (!session?.value) {
      return NextResponse.redirect(new URL('/crm/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/crm/:path*'],
}
