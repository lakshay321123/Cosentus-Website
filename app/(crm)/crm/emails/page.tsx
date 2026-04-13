'use client'

import { useState } from 'react'

const templates = [
  {
    id: 'welcome',
    name: 'Welcome — New Lead',
    subject: 'Quick question about your {{specialty}} billing',
    body: `Hi {{first_name}},

Thanks for reaching out to Cosentus. I saw you're running a {{specialty}} practice — that's exactly where we specialize.

Most {{specialty}} practices we work with are leaving 15-30% on the table without knowing it. Modifier errors, missed pass-throughs, and denial patterns that compound over time.

Would it be worth a quick 15-minute call this week to see if that's happening at {{practice_name}}? No pressure — just data.

Best,
{{sender_name}}
Cosentus | (877) 806-2286`,
    delay: 'Immediate',
    tags: ['new-lead', 'auto'],
  },
  {
    id: 'followup1',
    name: 'Follow-up #1 — Value Prop',
    subject: 'How we grew a {{specialty}} practice 46%',
    body: `Hi {{first_name}},

Wanted to share something relevant. We recently helped a {{specialty}} group grow revenue 46% in 12 months — from $1.5M to $2.2M — just by fixing coding accuracy and renegotiating contracts.

The biggest wins came from:
→ Catching modifier errors before claims go out
→ Workers' comp turnaround cut from 45 to 28 days
→ Dedicated denial appeals with 95%+ success rate

Happy to walk through what this could look like for {{practice_name}} — takes about 15 minutes.

{{sender_name}}
Cosentus`,
    delay: '3 days after welcome',
    tags: ['follow-up', 'auto'],
  },
  {
    id: 'case_study',
    name: 'Follow-up #2 — Case Study',
    subject: 'Case study: {{specialty}} practice results',
    body: `Hi {{first_name}},

I attached our latest {{specialty}} case study — real numbers from a practice similar to yours.

Key results:
→ Net collection rate over 98%
→ Clean claim rate over 99%
→ AR over 120 days under 15%

These aren't projections. They're documented outcomes from practices we manage today.

If you're curious what your numbers could look like, our free revenue analysis takes about a week and shows exactly where money is leaking.

No strings attached.

{{sender_name}}
Cosentus | (877) 806-2286`,
    delay: '7 days after follow-up #1',
    tags: ['follow-up', 'case-study'],
  },
  {
    id: 'breakup',
    name: 'Follow-up #3 — Breakup',
    subject: 'Should I close your file?',
    body: `Hi {{first_name}},

I've reached out a few times and haven't heard back — totally understand, you're busy running a practice.

I don't want to be that person who keeps emailing. So I'll keep your file open for 30 days in case timing changes.

If billing ever becomes a headache — or you just want a second opinion on your current setup — we're here.

All the best,
{{sender_name}}
Cosentus`,
    delay: '14 days after case study',
    tags: ['breakup', 'final'],
  },
  {
    id: 'meeting_confirm',
    name: 'Meeting Confirmation',
    subject: 'Confirmed: {{meeting_type}} call on {{meeting_date}}',
    body: `Hi {{first_name}},

Looking forward to our {{meeting_type}} call on {{meeting_date}}.

Here's what we'll cover:
→ Your current billing setup and pain points
→ Where revenue is likely leaking based on your specialty
→ What a partnership with Cosentus would look like

If anything comes up, just reply to reschedule. Otherwise, talk soon!

{{sender_name}}
Cosentus`,
    delay: 'On meeting scheduled',
    tags: ['meeting', 'confirmation'],
  },
  {
    id: 'post_meeting',
    name: 'Post-Meeting Follow-up',
    subject: 'Great talking today — next steps for {{practice_name}}',
    body: `Hi {{first_name}},

Thanks for taking the time today. Here's a quick recap:

{{meeting_notes}}

Next steps:
→ We'll send over the revenue analysis within 5 business days
→ You'll see exactly where collections are leaking
→ We'll schedule a follow-up to review the findings

In the meantime, feel free to call us at (877) 806-2286 if anything comes up.

{{sender_name}}
Cosentus`,
    delay: 'After meeting completed',
    tags: ['post-meeting'],
  },
]

export default function EmailsPage() {
  const [activeId, setActiveId] = useState(templates[0].id)
  const [copied, setCopied] = useState(false)

  const active = templates.find(t => t.id === activeId) || templates[0]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#000', margin: 0 }}>Email Templates</h1>
        <p style={{ fontSize: 14, color: '#616161', margin: '4px 0 0' }}>Pre-built sequences for sales outreach. Variables auto-fill from lead data.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
        {/* Template list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {templates.map(t => (
            <button key={t.id} onClick={() => setActiveId(t.id)} style={{
              padding: '14px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
              background: activeId === t.id ? 'rgba(0,181,214,0.08)' : 'white',
              outline: activeId === t.id ? '1px solid #00B5D6' : '1px solid #E6E6E6',
            }}>
              <div style={{ fontSize: 14, fontWeight: activeId === t.id ? 600 : 400, color: activeId === t.id ? '#00B5D6' : '#000' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#CCCCCC', marginTop: 4 }}>{t.delay}</div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', overflow: 'hidden' }}>
          {/* Subject */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
            <div style={{ fontSize: 11, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Subject</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#000' }}>{active.subject}</div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', fontSize: 14, lineHeight: 1.7, color: '#000', whiteSpace: 'pre-wrap' }}>
            {active.body}
          </div>

          {/* Actions */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E6E6E6', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => copyToClipboard(active.body)} style={{ background: '#00B5D6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {copied ? 'Copied!' : 'Copy Body'}
            </button>
            <button onClick={() => copyToClipboard(`Subject: ${active.subject}\n\n${active.body}`)} style={{ background: 'white', color: '#616161', border: '1px solid #E6E6E6', borderRadius: 6, padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>
              Copy All
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 4 }}>
              {active.tags.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#F5F5F5', color: '#616161' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Variables guide */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F5F5F5', background: '#FAFAFA' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Available Variables</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['{{first_name}}', '{{last_name}}', '{{practice_name}}', '{{specialty}}', '{{sender_name}}', '{{meeting_type}}', '{{meeting_date}}', '{{meeting_notes}}'].map(v => (
                <span key={v} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(0,181,214,0.08)', color: '#00B5D6', fontFamily: 'monospace' }}>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
