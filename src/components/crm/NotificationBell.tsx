'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string; created_at: string; type: string; title: string; body: string | null
  read: boolean; lead_id: string | null; link: string | null
}

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data, error }) => {
        if (error) console.error('Failed to load notifications:', error.message)
        if (data) setNotifs(data as Notification[])
      })

    const channel = supabase.channel('notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (p) => {
        if (p.new && p.new.id && p.new.title) {
          setNotifs(prev => [p.new as Notification, ...prev].slice(0, 20))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const unread = notifs.filter(n => !n.read).length
  const unreadIds = notifs.filter(n => !n.read).map(n => n.id)

  const markRead = async (n: Notification) => {
    if (!n.read) {
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
      await supabase.from('notifications').update({ read: true }).eq('id', n.id)
    }
    if (n.link) { setOpen(false); router.push(n.link) }
  }

  const markAllRead = async () => {
    if (unreadIds.length === 0) return
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    await supabase.from('notifications').update({ read: true }).in('id', unreadIds)
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const typeIcon: Record<string, string> = { new_lead: '👤', task_overdue: '⚠', meeting_soon: '📅', deal_won: '🎉', workflow: '⚡', system: 'ℹ' }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, border: 'none', background: open ? '#D6EBF2' : 'transparent', cursor: 'pointer', position: 'relative' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, background: '#00B5D6', color: '#fff', fontSize: 9, fontWeight: 700, padding: '0 4px', borderRadius: 8, minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 340, background: '#fff', borderRadius: 14, border: '1px solid #E6E6E6', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, maxHeight: 400, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #E6E6E6' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>Notifications</span>
            {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: '#00B5D6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Reddit Sans', sans-serif" }}>Mark all read</button>}
          </div>
          {notifs.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: '#CCCCCC' }}>No notifications</div>
          ) : notifs.map(n => (
            <div key={n.id} onClick={() => markRead(n)} style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: '1px solid #E6E6E6', cursor: 'pointer', background: n.read ? 'transparent' : '#D6EBF2' }}>
              <span style={{ fontSize: 14 }}>{typeIcon[n.type] || 'ℹ'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>{n.title}</div>
                {n.body && <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>{n.body}</div>}
                <div style={{ fontSize: 11, color: '#CCCCCC', marginTop: 3 }}>{formatTime(n.created_at)}{n.link ? ' · Click to view' : ''}</div>
              </div>
              {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', marginTop: 6, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
