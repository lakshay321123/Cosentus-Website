import { NextRequest, NextResponse } from 'next/server'

// API routes that accept unauthenticated POST (public forms, webhooks, voice agent)
const PUBLIC_POST_ROUTES = ['/api/crm/leads', '/api/crm/voice-capture', '/api/crm/webhook']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CRM pages: require session (except login)
  if (pathname.startsWith('/crm') && !pathname.startsWith('/crm/login') && !pathname.startsWith('/api/')) {
    const session = request.cookies.get('crm_session')
    if (!session?.value) {
      return NextResponse.redirect(new URL('/crm/login', request.url))
    }
  }

  // CRM API routes: require session with exceptions
  if (pathname.startsWith('/api/crm')) {
    // Auth route handles its own authentication
    if (pathname.startsWith('/api/crm/auth')) return NextResponse.next()

    // Allow unauthenticated POST to public endpoints (contact form, voice agent, webhooks)
    if (request.method === 'POST' && PUBLIC_POST_ROUTES.some(r => pathname.startsWith(r))) {
      return NextResponse.next()
    }

    // Everything else requires a session
    const session = request.cookies.get('crm_session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/crm/:path*', '/api/crm/:path*'],
}
