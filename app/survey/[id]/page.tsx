'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { supabase } from '@/lib/supabase'

export default function SurveyResponsePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [survey, setSurvey] = useState<any>(null)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('surveys').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setSurvey(data); setLoading(false) })
  }, [id])

  const handleSubmit = async () => {
    if (score === null) return
    await supabase.from('survey_responses').insert({
      survey_id: id, score, feedback: feedback || null,
      respondent_name: name || null, respondent_email: email || null,
    })
    await supabase.from('surveys').update({
      responses_count: (survey?.responses_count || 0) + 1,
    }).eq('id', id)
    setSubmitted(true)
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif", color: '#000' }}>Loading...</div>
  if (!survey) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif", color: '#000' }}>Survey not found</div>

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif", background: '#fff' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#000', margin: '0 0 8px' }}>Thank you!</h1>
        <p style={{ fontSize: 'var(--text-base)', color: '#000' }}>Your feedback helps us improve our service.</p>
      </div>
    </div>
  )

  const isNPS = survey.type === 'nps'
  const maxScore = isNPS ? 10 : 5

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Reddit Sans', sans-serif", background: '#fff', padding: 20 }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 28, marginBottom: 24 }} />
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#000', margin: '0 0 8px' }}>{survey.name}</h1>
        <p style={{ fontSize: 'var(--text-base)', color: '#000', margin: '0 0 32px' }}>
          {isNPS ? 'How likely are you to recommend Cosentus to a colleague?' : 'How satisfied are you with our service?'}
        </p>

        {/* Score selection */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {Array.from({ length: maxScore + 1 }, (_, i) => isNPS ? i : i + 1).filter(i => i <= maxScore).map(n => {
            const val = isNPS ? n : n
            return (
              <button key={val} onClick={() => setScore(val)} style={{
                width: 44, height: 44, borderRadius: 10, border: score === val ? '2px solid #00B5D6' : '1px solid #E6E6E6',
                background: score === val ? '#00B5D6' : '#fff', color: score === val ? '#fff' : '#000',
                fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer', fontFamily: "'Reddit Sans', sans-serif",
              }}>{val}</button>
            )
          })}
        </div>
        {isNPS && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xxs)', color: '#CCCCCC', marginTop: -20, marginBottom: 24 }}><span>Not likely</span><span>Very likely</span></div>}

        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Any additional feedback? (optional)"
          rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 'var(--text-sm)', fontFamily: "'Reddit Sans', sans-serif", marginBottom: 16, boxSizing: 'border-box', resize: 'vertical' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 'var(--text-sm)', fontFamily: "'Reddit Sans', sans-serif" }} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email (optional)" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E6E6E6', fontSize: 'var(--text-sm)', fontFamily: "'Reddit Sans', sans-serif" }} />
        </div>

        <button onClick={handleSubmit} disabled={score === null} style={{
          width: '100%', padding: '14px', borderRadius: 10, background: score !== null ? '#00B5D6' : '#E6E6E6',
          color: score !== null ? '#fff' : '#CCCCCC', border: 'none', fontSize: 'var(--text-base)', fontWeight: 600,
          cursor: score !== null ? 'pointer' : 'not-allowed', fontFamily: "'Reddit Sans', sans-serif",
        }}>Submit Feedback</button>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 'var(--text-xxs)', color: '#CCCCCC' }}>Cosentus · (877) 806-2286 · cosentus.com</div>
      </div>
    </div>
  )
}
