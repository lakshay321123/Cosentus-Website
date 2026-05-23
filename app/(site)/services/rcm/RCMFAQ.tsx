'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

/* ── RCM 360 FAQs ──
   Originally added inline at the bottom of RCMContent.tsx in PR #155.
   Extracted to its own file so page.tsx can position it AFTER the
   Testimonials and CTA sections (user direction: 'Faq in Rcm 360
   needs to be the last section after Testimonials, and testimonials
   needs to be above CTA section'). The data, helper components, and
   section markup are unchanged from the PR #155 version — only the
   file location moved.

   Topic structure mirrors the cosentus.com/services/complete-practice-
   management/ FAQ block per earlier user direction (definition /
   importance / what's included / vs. alternatives / how it works /
   outcomes / specialties / verification). Answers are grounded in
   data already on the page (the 10 rcmSteps and the 6 result stats)
   so the FAQ cannot contradict what the rest of the page already
   claims. */
const rcmFaqs = [
  { q: 'What is RCM 360?',
    a: 'RCM 360 is Cosentus’s end-to-end revenue cycle management offering. We manage every stage of your revenue cycle — from patient registration and eligibility verification through coding, claim submission, payment posting, denial management, and patient collections — with specialty-trained teams supported by AI voice agents. One accountable team. One dashboard. Every dollar.' },
  { q: 'Why is end-to-end revenue cycle management important?',
    a: 'Most practices run their revenue cycle in disconnected pieces — eligibility in one system, coding in another, denials handled by a third group. Every handoff between teams is a gap where revenue leaks. Missed eligibility checks become rejections. Slow prior authorizations become OR delays. Unworked denials age out of timely filing. RCM 360 closes those gaps by owning the cycle end to end under one accountable team.' },
  { q: 'What services are included in RCM 360?',
    a: 'Eligibility verification, prior authorization management, pre-service payment collection, charge capture with AAPC-certified coding, claim scrubbing and submission, payment posting and reconciliation, AR follow-up, denial management and appeals, patient billing and collections in 50+ languages, credentialing and contracting, and real-time reporting dashboards.' },
  { q: 'What’s the difference between RCM 360 and traditional medical billing services?',
    a: 'Traditional billing services usually cover only the back end — claim submission and basic follow-up. RCM 360 covers the entire cycle, both front-end activities (eligibility, prior auth, pre-service collection) and back-end activities (denials, underpayment recovery, patient billing), with AI handling repetitive volume and named human specialists handling judgment work.' },
  { q: 'How does RCM 360 use AI?',
    a: 'Specialized AI voice agents handle the high-volume repetitive workflows — eligibility verification, prior authorization follow-ups, pre-service patient outreach, claim status checks, payment reconciliation, and patient collections in 50+ languages. Human specialists own the work that requires judgment: complex coding, clinical denial appeals, underpayment recovery, and payer negotiation. AI handles volume, humans handle judgment, every action surfaces to your dashboard.' },
  { q: 'What measurable outcomes can I expect from RCM 360?',
    a: 'Greater than 98% net collection rate, greater than 99% clean claim rate, charge lag of 48 hours, AR over 90 days under 15%, and up to 30% revenue growth within twelve months. Actual results depend on specialty, payer mix, and starting baseline.' },
  { q: 'What specialties does RCM 360 support?',
    a: 'Anesthesia, orthopedics, pain management, ambulatory surgery centers (ASCs), behavioral health, and multi-specialty practices. Each specialty has a dedicated team trained on its specific coding rules, payer policies, and common denial patterns.' },
  { q: 'How do I track and verify performance?',
    a: 'Real-time dashboards segmented by provider, payer, procedure, and denial category, plus weekly check-ins with your account team, monthly operational reviews, and quarterly business reviews. You see every claim status, every denial reason, and every dollar in motion — no waiting for end-of-month reports.' },
]

/* ── Inline FAQItem / FAQList ──
   Pattern matches BillingCodingContent.tsx, EHRContent.tsx, and
   PracticeManagementContent.tsx, which all keep these helpers inline
   rather than sharing a single ui/FAQ.tsx. Staying consistent with
   the codebase here — a shared component would be a separate
   refactor across all four services pages. */
function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ marginBottom: 8, borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', overflow: 'hidden', transition: 'border-color 0.2s ease', borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)' }}>
      <button onClick={onToggle} aria-expanded={isOpen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '18px 24px', background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16, transition: 'background 0.2s ease', fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.5, flex: 1 }}>{q}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2.5} style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 20px', background: 'white' }}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)', paddingTop: 12, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

function FAQList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = useState(-1)
  return (
    <div>
      {faqs.map((faq, i) => (
        <FAQItem key={i} q={faq.q} a={faq.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
      ))}
    </div>
  )
}

export default function RCMFAQ() {
  return (
    /* section-alt for soft grey background — matches the FAQ
       section style on BillingCodingContent.tsx. The id='faq' anchor
       is preserved from the PR #155 implementation so any external
       links to /services/rcm#faq still work. */
    <section className="section section-alt" id="faq">
      <div className="container">
        <RevealOnScroll>
          <div className="section-title">Frequently Asked Questions</div>
        </RevealOnScroll>
        <div style={{ marginTop: 48, maxWidth: 880 }}>
          <FAQList faqs={rcmFaqs} />
        </div>
      </div>
    </section>
  )
}
