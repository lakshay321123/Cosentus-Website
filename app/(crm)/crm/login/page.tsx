'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CRMLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/crm/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (res.ok) { router.push('/crm'); router.refresh() } else setError('Incorrect password')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', fontFamily: "'Reddit Sans', -apple-system, sans-serif" }}>
      <div style={{ width: 380, background: '#ffffff',  borderRadius: 20, padding: '48px 36px', textAlign: 'center', boxShadow: '0 4px 24px #E6E6E6' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 32, marginBottom: 8 }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#00B5D6', marginBottom: 36 }}>CRM</div>

        <form onSubmit={handleLogin}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoFocus
            style={{
              width: '100%', padding: '14px 18px', borderRadius: 14, fontSize: 16, outline: 'none',
              border: error ? '1.5px solid #616161' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: 'inset 0 1px 2px #E6E6E6',
              fontFamily: "'Reddit Sans', sans-serif", color: '#000000', boxSizing: 'border-box',
              WebkitAppearance: 'none',
            }}
          />
          {error && <div style={{ fontSize: 14, color: '#616161', marginTop: 10 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', marginTop: 18, borderRadius: 14,
            background: '#00B5D6', color: '#fff', border: 'none',
            fontSize: 16, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            fontFamily: "'Reddit Sans', sans-serif", opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseDown={e => { if (!loading) (e.target as HTMLElement).style.transform = 'scale(0.98)' }}
          onMouseUp={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <div style={{ fontSize: 13, color: '#E6E6E6', marginTop: 28 }}>Authorized access only</div>
      </div>
    </div>
  )
}
