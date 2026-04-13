import { NextRequest, NextResponse } from 'next/server'

const CRM_PASSWORD = process.env.CRM_PASSWORD || 'cosentus2026'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (password === CRM_PASSWORD) {
      const token = Buffer.from(`crm_auth_${Date.now()}_${Math.random().toString(36).slice(2)}`).toString('base64')
      const res = NextResponse.json({ success: true })
      res.cookies.set('crm_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('crm_session')
  return res
}
