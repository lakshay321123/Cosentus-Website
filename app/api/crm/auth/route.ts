import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

/** Compare password against stored hash. If stored value is plaintext (legacy), auto-upgrade to bcrypt. */
async function verifyAndMigrate(password: string, storedHash: string, userId: string): Promise<boolean> {
  const isBcrypt = storedHash.startsWith('$2')

  if (isBcrypt) {
    return bcrypt.compare(password, storedHash)
  }

  // Legacy plaintext comparison — auto-upgrade on match
  if (password === storedHash) {
    const hashed = await bcrypt.hash(password, 12)
    await supabase.from('crm_users').update({ password_hash: hashed }).eq('id', userId)
    return true
  }

  return false
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Multi-user: check crm_users table
    if (email) {
      const { data: user } = await supabase.from('crm_users').select('*').eq('email', email).eq('is_active', true).single()
      if (user && await verifyAndMigrate(password, user.password_hash, user.id)) {
        await supabase.from('crm_users').update({ last_login: new Date().toISOString() }).eq('id', user.id)
        const session = { id: user.id, name: user.name, email: user.email, role: user.role }
        const res = NextResponse.json({ success: true, user: session })
        res.cookies.set('crm_session', JSON.stringify(session), COOKIE_OPTIONS)
        return res
      }
    }

    // Admin fallback: requires CRM_PASSWORD env var — no hardcoded default
    const masterPassword = process.env.CRM_PASSWORD
    if (masterPassword && password === masterPassword) {
      const session = { name: 'Admin', role: 'admin' }
      const res = NextResponse.json({ success: true, user: session })
      res.cookies.set('crm_session', JSON.stringify(session), COOKIE_OPTIONS)
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
