'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Survey { id: string; name: string; type: string; status: string; questions: any[]; responses_count: number; avg_score: number; created_at: string }
interface SurveyResponse { id: string; survey_id: string; respondent_name: string; respondent_email: string; score: number; feedback: string | null; created_at: string }

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('surveys').select('*').order('created_at', { ascending: false }),
      supabase.from('survey_responses').select('*').order('created_at', { ascending: false }),
    ]).then(([sRes, rRes]) => {
      if (sRes.data) setSurveys(sRes.data as Survey[])
      if (rRes.data) setResponses(rRes.data as SurveyResponse[])
      setLoading(false)
    })
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const survey = {
      name: fd.get('name') as string,
      type: fd.get('type') as string,
      status: 'draft',
      questions: fd.get('type') === 'nps'
        ? [{ id: 1, text: 'How likely are you to recommend Cosentus to a colleague?', type: 'scale', min: 0, max: 10 }, { id: 2, text: 'What could we do better?', type: 'text' }]
        : fd.get('type') === 'csat'
        ? [{ id: 1, text: 'How satisfied are you with Cosentus services?', type: 'scale', min: 1, max: 5 }, { id: 2, text: 'Any feedback for our team?', type: 'text' }]
        : [{ id: 1, text: 'Question 1', type: 'text' }],
    }
    const { data } = await supabase.from('surveys').insert(survey).select()
    if (data) { setSurveys(prev => [data[0] as Survey, ...prev]); setShowCreate(false) }
  }

  const toggleStatus = async (s: Survey) => {
    const ns = s.status === 'active' ? 'closed' : 'active'
    setSurveys(prev => prev.map(sv => sv.id === s.id ? { ...sv, status: ns } : sv))
    await supabase.from('surveys').update({ status: ns }).eq('id', s.id)
  }

  const viewResponses = (surveyId: string) => setViewing(viewing === surveyId ? null : surveyId)
  const surveyResponses = (id: string) => responses.filter(r => r.survey_id === id)

  const getNPSBreakdown = (resps: SurveyResponse[]) => {
    const promoters = resps.filter(r => r.score >= 9).length
    const passives = resps.filter(r => r.score >= 7 && r.score <= 8).length
    const detractors = resps.filter(r => r.score <= 6).length
    const total = resps.length || 1
    const nps = Math.round(((promoters - detractors) / total) * 100)
    return { promoters, passives, detractors, nps }
  }

  if (loading) return <div style={{ padding: 40, color: '#8E8E93' }}>Loading surveys...</div>

  return (
    <div style={{ padding: '36px 44px', maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#1C1C1E', margin: 0 }}>Surveys</h1>
          <p style={{ fontSize: 14, color: '#8E8E93', margin: '4px 0 0' }}>Client feedback — NPS, CSAT, custom surveys</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Create Survey</button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 16, border: '1px solid rgba(0,181,214,0.3)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input name="name" placeholder="Survey name *" required style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13 }} />
            <select name="type" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', fontSize: 13, background: 'white' }}>
              <option value="nps">NPS (Net Promoter Score)</option>
              <option value="csat">CSAT (Customer Satisfaction)</option>
              <option value="custom">Custom Survey</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="submit" style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Create Survey</button>
            <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'transparent', color: '#8E8E93', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', borderRadius: 10, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {surveys.map(s => {
          const resps = surveyResponses(s.id)
          const breakdown = s.type === 'nps' ? getNPSBreakdown(resps) : null
          return (
            <div key={s.id} style={{ background: 'white', borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E' }}>{s.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: s.status === 'active' ? '#E1F5EE' : s.status === 'closed' ? '#E6F1FB' : '#F5F5F5', color: s.status === 'active' ? '#085041' : s.status === 'closed' ? '#185FA5' : '#616161', textTransform: 'capitalize' }}>{s.status}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.03)', color: '#8E8E93', textTransform: 'uppercase' }}>{s.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>{resps.length} responses · {s.questions.length} questions</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleStatus(s)} style={{ padding: '6px 12px', borderRadius: 10, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', background: 'white', fontSize: 12, cursor: 'pointer' }}>{s.status === 'active' ? 'Close' : 'Activate'}</button>
                  <button onClick={() => viewResponses(s.id)} style={{ padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(0,181,214,0.3)', background: 'white', fontSize: 12, cursor: 'pointer', color: '#00B5D6' }}>{viewing === s.id ? 'Hide' : 'Responses'}</button>
                </div>
              </div>

              {breakdown && resps.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                  <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 300, color: breakdown.nps >= 50 ? '#085041' : breakdown.nps >= 0 ? '#854F0B' : '#791F1F' }}>{breakdown.nps}</div>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>NPS Score</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 300, color: '#085041' }}>{breakdown.promoters}</div>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>Promoters</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 300, color: '#854F0B' }}>{breakdown.passives}</div>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>Passives</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 300, color: '#791F1F' }}>{breakdown.detractors}</div>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>Detractors</div>
                  </div>
                </div>
              )}

              {viewing === s.id && (
                <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: 12 }}>
                  {resps.length === 0 ? (
                    <div style={{ fontSize: 13, color: '#C7C7CC', textAlign: 'center', padding: 16 }}>No responses yet</div>
                  ) : resps.map(r => (
                    <div key={r.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.04)', fontSize: 13 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.score >= 9 ? '#E1F5EE' : r.score >= 7 ? '#FAEEDA' : '#FCEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: r.score >= 9 ? '#085041' : r.score >= 7 ? '#854F0B' : '#791F1F', flexShrink: 0 }}>{r.score}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#1C1C1E' }}>{r.respondent_name || r.respondent_email}</div>
                        {r.feedback && <div style={{ color: '#8E8E93', marginTop: 2 }}>{r.feedback}</div>}
                      </div>
                      <div style={{ fontSize: 11, color: '#C7C7CC' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
