'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CRMLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/crm/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email || undefined, password }) })
      const data = await res.json()
      if (res.ok) { router.push('/crm'); router.refresh() } else setError(data.error || 'Invalid credentials')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: "'Reddit Sans', sans-serif" }}>
      <div style={{ width: 380, padding: '48px 36px', textAlign: 'center' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 32, marginBottom: 8 }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#00B5D6', marginBottom: 36 }}>CRM</div>

        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional for admin)"
            style={{ width: '100%', padding: '14px 18px', borderRadius: 14, fontSize: 15, outline: 'none', border: '1px solid #E6E6E6', fontFamily: "'Reddit Sans', sans-serif", color: '#000', boxSizing: 'border-box', marginBottom: 10 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoFocus required
            style={{ width: '100%', padding: '14px 18px', borderRadius: 14, fontSize: 15, outline: 'none', border: error ? '2px solid #00B5D6' : '1px solid #E6E6E6', fontFamily: "'Reddit Sans', sans-serif", color: '#000', boxSizing: 'border-box' }} />
          {error && <div style={{ fontSize: 14, color: '#00B5D6', marginTop: 10, fontWeight: 600 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', marginTop: 18, borderRadius: 14, background: '#00B5D6', color: '#fff', border: 'none',
            fontSize: 16, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: "'Reddit Sans', sans-serif", opacity: loading ? 0.6 : 1,
          }}>{loading ? 'Signing in...' : 'Continue'}</button>
        </form>

        <div style={{ fontSize: 12, color: '#CCCCCC', marginTop: 28 }}>
          Team login: use your email + password<br/>
          Admin: password only
        </div>
      </div>
    </div>
  )
}
