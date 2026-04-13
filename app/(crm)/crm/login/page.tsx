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
      const res = await fetch('/api/crm/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/crm')
        router.refresh()
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
      <div style={{ width: 400, background: 'white', borderRadius: 16, border: '1px solid #E6E6E6', padding: '48px 40px', textAlign: 'center' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 36, marginBottom: 8 }} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#00B5D6', textTransform: 'uppercase', marginBottom: 32 }}>CRM Platform</div>

        <form onSubmit={handleLogin}>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter CRM password"
            autoFocus
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 8,
              border: error ? '1px solid #E24B4A' : '1px solid #E6E6E6',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Reddit Sans', sans-serif",
            }}
          />
          {error && <div style={{ fontSize: 13, color: '#E24B4A', marginTop: 8 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', marginTop: 16, borderRadius: 8,
            background: '#00B5D6', color: 'white', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            fontFamily: "'Reddit Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ fontSize: 12, color: '#CCCCCC', marginTop: 24 }}>Protected area — authorized Cosentus team only</div>
      </div>
    </div>
  )
}
