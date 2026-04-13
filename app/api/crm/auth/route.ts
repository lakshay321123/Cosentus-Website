import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Multi-user: check crm_users table
    if (email) {
      const { data: user } = await supabase.from('crm_users').select('*').eq('email', email).eq('is_active', true).single()
      if (user && user.password_hash === password) {
        await supabase.from('crm_users').update({ last_login: new Date().toISOString() }).eq('id', user.id)
        const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
        res.cookies.set('crm_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
        return res
      }
    }

    // Fallback: single password auth (backward compatible)
    const masterPassword = process.env.CRM_PASSWORD || 'cosentus2026'
    if (password === masterPassword) {
      const res = NextResponse.json({ success: true, user: { name: 'Admin', role: 'admin' } })
      res.cookies.set('crm_session', JSON.stringify({ name: 'Admin', role: 'admin' }), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
      return res
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('crm_session')
  return res
}

// GET: return current user from session
export async function GET(req: NextRequest) {
  const session = req.cookies.get('crm_session')?.value
  if (!session) return NextResponse.json({ user: null }, { status: 401 })
  try {
    return NextResponse.json({ user: JSON.parse(session) })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
