/**
 * Cosentus Branded Email Template System
 * 
 * Generates responsive HTML emails with Cosentus branding.
 * All templates are inline-styled for maximum email client compatibility.
 */

interface EmailData {
  first_name?: string
  last_name?: string
  practice_name?: string
  specialty?: string
  sender_name?: string
  sender_title?: string
  meeting_type?: string
  meeting_date?: string
  meeting_notes?: string
  survey_link?: string
  custom_body?: string
}

const BRAND = {
  primary: '#00B5D6',
  dark: '#36C2DE',
  black: '#000000',
  gray: '#616161',
  lightGray: '#F5F5F5',
  border: '#E6E6E6',
  white: '#ffffff',
  logoUrl: 'https://cosentus.com/images/cosentus-logo.png',
  phone: '(877) 806-2286',
  email: 'sales@cosentus.com',
  website: 'https://cosentus.com',
  bookingUrl: 'https://cosentus.com/book',
}

function header() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.white};border-bottom:3px solid ${BRAND.primary};">
      <tr>
        <td style="padding:24px 32px;">
          <img src="${BRAND.logoUrl}" alt="Cosentus" height="32" style="height:32px;width:auto;" />
        </td>
        <td style="padding:24px 32px;text-align:right;">
          <span style="font-size:12px;color:${BRAND.primary};font-weight:600;letter-spacing:0.1em;">REAL + ARTIFICIAL INTELLIGENCE</span>
        </td>
      </tr>
    </table>`
}

function footer() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lightGray};border-top:1px solid ${BRAND.border};">
      <tr>
        <td style="padding:32px;text-align:center;">
          <p style="margin:0 0 12px;font-size:13px;color:${BRAND.gray};">
            <strong style="color:${BRAND.black};">Cosentus</strong> · Healthcare Revenue Cycle Management
          </p>
          <p style="margin:0 0 8px;font-size:12px;color:${BRAND.gray};">
            ${BRAND.phone} · ${BRAND.email} · <a href="${BRAND.website}" style="color:${BRAND.primary};text-decoration:none;">cosentus.com</a>
          </p>
          <p style="margin:0 0 16px;font-size:11px;color:#CCCCCC;">
            SOC 2 · HIPAA Compliant · HBMA Member · Inc. 5000 · Great Place to Work
          </p>
          <p style="margin:0;font-size:11px;color:#CCCCCC;">
            300 Spectrum Center Dr, Suite 1450, Irvine, CA 92618
          </p>
        </td>
      </tr>
    </table>`
}

function ctaButton(text: string, url: string) {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:${BRAND.primary};border-radius:8px;padding:14px 32px;">
          <a href="${url}" style="color:${BRAND.white};text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,sans-serif;display:inline-block;">${text}</a>
        </td>
      </tr>
    </table>`
}

function wrap(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Cosentus</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F0F0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F0F0;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr><td>${header()}</td></tr>
          <tr><td style="padding:32px;">${content}</td></tr>
          <tr><td>${footer()}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function fillVars(text: string, data: EmailData): string {
  return text
    .replace(/\{\{first_name\}\}/g, data.first_name || 'there')
    .replace(/\{\{last_name\}\}/g, data.last_name || '')
    .replace(/\{\{practice_name\}\}/g, data.practice_name || 'your practice')
    .replace(/\{\{specialty\}\}/g, data.specialty?.replace('_', ' ') || 'your specialty')
    .replace(/\{\{sender_name\}\}/g, data.sender_name || 'The Cosentus Team')
    .replace(/\{\{sender_title\}\}/g, data.sender_title || 'Revenue Growth Specialist')
    .replace(/\{\{meeting_type\}\}/g, data.meeting_type || 'discovery')
    .replace(/\{\{meeting_date\}\}/g, data.meeting_date || 'TBD')
    .replace(/\{\{meeting_notes\}\}/g, data.meeting_notes || '')
    .replace(/\{\{survey_link\}\}/g, data.survey_link || '#')
}

export function generateEmail(templateId: string, data: EmailData): { subject: string; html: string; text: string } {
  const templates: Record<string, { subject: string; body: (d: EmailData) => string }> = {
    welcome: {
      subject: `Quick question about your {{specialty}} billing`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Thanks for reaching out to Cosentus. I saw you're running a <strong style="color:${BRAND.black};">{{specialty}}</strong> practice — that's exactly where we specialize.
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Most {{specialty}} practices we work with are leaving <strong style="color:${BRAND.primary};">15–30% on the table</strong> without knowing it. Modifier errors, missed pass-throughs, and denial patterns that compound over time.
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Would it be worth a quick 15-minute call this week to see if that's happening at {{practice_name}}?
        </p>
        ${ctaButton('Book a 15-Min Call', BRAND.bookingUrl)}
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          {{sender_name}}<br/>
          <span style="color:#CCCCCC;">{{sender_title}} · Cosentus</span>
        </p>`,
    },

    follow_up_value: {
      subject: `How we grew a {{specialty}} practice 46%`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Wanted to share something relevant. We recently helped a {{specialty}} group grow revenue <strong style="color:${BRAND.primary};">46% in 12 months</strong> — just by fixing coding accuracy and renegotiating contracts.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${BRAND.lightGray};border-radius:8px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${BRAND.black};">The biggest wins came from:</p>
              <p style="margin:0 0 6px;font-size:14px;color:${BRAND.gray};">→ Catching modifier errors before claims go out</p>
              <p style="margin:0 0 6px;font-size:14px;color:${BRAND.gray};">→ Workers' comp turnaround cut from 45 to 28 days</p>
              <p style="margin:0;font-size:14px;color:${BRAND.gray};">→ Dedicated denial appeals with 95%+ success rate</p>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Happy to walk through what this could look like for {{practice_name}}.
        </p>
        ${ctaButton('Schedule a Call', BRAND.bookingUrl)}
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          {{sender_name}}<br/>
          <span style="color:#CCCCCC;">Cosentus · ${BRAND.phone}</span>
        </p>`,
    },

    case_study: {
      subject: `Case study: {{specialty}} practice results`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Here's our latest {{specialty}} case study — real numbers from a practice similar to yours.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.primary};padding:16px 24px;">
              <span style="font-size:14px;font-weight:600;color:${BRAND.white};letter-spacing:0.05em;">KEY RESULTS</span>
            </td>
          </tr>
          <tr><td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};font-size:14px;"><span style="color:${BRAND.gray};">Net Collection Rate</span></td>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};text-align:right;font-size:18px;font-weight:600;color:${BRAND.primary};">>98%</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};font-size:14px;"><span style="color:${BRAND.gray};">Clean Claim Rate</span></td>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};text-align:right;font-size:18px;font-weight:600;color:${BRAND.primary};">>99%</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};font-size:14px;"><span style="color:${BRAND.gray};">AR >120 Days</span></td>
                <td style="padding:8px 0;border-bottom:1px solid ${BRAND.lightGray};text-align:right;font-size:18px;font-weight:600;color:${BRAND.primary};"><15%</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;"><span style="color:${BRAND.gray};">Revenue Growth</span></td>
                <td style="padding:8px 0;text-align:right;font-size:18px;font-weight:600;color:${BRAND.primary};">Up to 30%</td>
              </tr>
            </table>
          </td></tr>
        </table>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          These aren't projections — they're documented outcomes. Want to see what your numbers could look like?
        </p>
        ${ctaButton('Get Your Free Revenue Analysis', BRAND.bookingUrl)}
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          {{sender_name}}<br/>
          <span style="color:#CCCCCC;">Cosentus · ${BRAND.phone}</span>
        </p>`,
    },

    meeting_confirm: {
      subject: `Confirmed: {{meeting_type}} call — {{meeting_date}}`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          Looking forward to our <strong style="color:${BRAND.black};">{{meeting_type}}</strong> call.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.lightGray};border-radius:8px;border-left:4px solid ${BRAND.primary};">
          <tr><td style="padding:20px 24px;">
            <p style="margin:0 0 4px;font-size:18px;font-weight:600;color:${BRAND.black};">{{meeting_date}}</p>
            <p style="margin:0;font-size:14px;color:${BRAND.gray};">{{meeting_type}} · 30 minutes</p>
          </td></tr>
        </table>
        <p style="margin:20px 0 0;font-size:14px;font-weight:600;color:${BRAND.black};">What we'll cover:</p>
        <p style="margin:8px 0 0;font-size:14px;color:${BRAND.gray};line-height:1.8;">
          → Your current billing setup and pain points<br/>
          → Where revenue is likely leaking based on your specialty<br/>
          → What a partnership with Cosentus would look like
        </p>
        <p style="margin:20px 0 0;font-size:14px;color:${BRAND.gray};">
          If anything comes up, just reply to reschedule.
        </p>
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          {{sender_name}}<br/>
          <span style="color:#CCCCCC;">Cosentus · ${BRAND.phone}</span>
        </p>`,
    },

    breakup: {
      subject: `Should I close your file?`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          I've reached out a few times and haven't heard back — totally understand, you're busy running a practice.
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          I don't want to be that person who keeps emailing. So I'll keep your file open for 30 days in case timing changes.
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          If billing ever becomes a headache — or you just want a second opinion on your current setup — we're here.
        </p>
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          All the best,<br/>
          {{sender_name}}<br/>
          <span style="color:#CCCCCC;">Cosentus · ${BRAND.phone}</span>
        </p>`,
    },

    survey_invite: {
      subject: `Quick question — how are we doing?`,
      body: (d) => `
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:300;color:${BRAND.black};">Hi {{first_name}},</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          We'd love to hear how things are going with {{practice_name}}. Your feedback helps us improve — and it only takes 30 seconds.
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${BRAND.gray};">
          <strong style="color:${BRAND.black};">One question:</strong> How likely are you to recommend Cosentus to a colleague? (0–10)
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
          <tr>
            ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `<td style="text-align:center;"><a href="{{survey_link}}?score=${n}" style="display:inline-block;width:36px;height:36px;line-height:36px;border-radius:8px;background:${n >= 9 ? '#E1F5EE' : n >= 7 ? '#FAEEDA' : '#FCEBEB'};color:${n >= 9 ? '#085041' : n >= 7 ? '#854F0B' : '#791F1F'};text-decoration:none;font-size:14px;font-weight:600;">${n}</a></td>`).join('')}
          </tr>
        </table>
        <p style="margin:0;font-size:12px;color:#CCCCCC;text-align:center;">0 = Not likely · 10 = Extremely likely</p>
        <p style="margin:24px 0 0;font-size:14px;color:${BRAND.gray};">
          Thank you,<br/>
          <span style="color:#CCCCCC;">The Cosentus Team</span>
        </p>`,
    },
  }

  const template = templates[templateId]
  if (!template) return { subject: '', html: '', text: '' }

  const subject = fillVars(template.subject, data)
  const bodyHtml = fillVars(template.body(data), data)
  const html = wrap(bodyHtml)
  const text = bodyHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

  return { subject, html, text }
}

export const templateList = [
  { id: 'welcome', name: 'Welcome — New Lead', delay: 'Immediate', category: 'outreach' },
  { id: 'follow_up_value', name: 'Follow-up — Value Prop', delay: '+3 days', category: 'outreach' },
  { id: 'case_study', name: 'Follow-up — Case Study', delay: '+7 days', category: 'outreach' },
  { id: 'meeting_confirm', name: 'Meeting Confirmation', delay: 'On booking', category: 'meetings' },
  { id: 'breakup', name: 'Breakup Email', delay: '+14 days', category: 'outreach' },
  { id: 'survey_invite', name: 'NPS Survey Invite', delay: 'Manual', category: 'feedback' },
]
