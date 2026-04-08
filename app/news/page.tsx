import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Cosentus News — Healthcare RCM, AI & Medical Billing Updates',
  description: 'Stay informed with the latest healthcare RCM news, policy updates, AI innovations, and industry insights curated by Cosentus.',
}

const newsItems = [
  { title: 'Congress Moves to Stop the Bleeding: New Bill Would Cap Annual Medicare Pay Cuts at 2.5%', date: 'April 7, 2026', tag: 'Medicare Policy' },
  { title: 'A Huge Month for CMS Policy: Four Changes Every Specialty Practice Must Know', date: 'March 31, 2026', tag: 'CMS Policy' },
  { title: 'ASC Reimbursement & Payer Strategy', date: 'March 24, 2026', tag: 'ASC' },
  { title: 'Medicare ASC Spending Surges 16% in One Year — Pain Management and Cardiology Lead the Growth', date: 'March 17, 2026', tag: 'Medicare' },
  { title: 'BCBS Michigan to Cut 50% from Same-Day E/M Payments — Every Specialty Practice Needs to Act Before May 1', date: 'March 10, 2026', tag: 'Payer Updates' },
  { title: 'Cardiology Faces $700 Million Medicare Reimbursement Loss as 2026 Payment Cuts Deepen Financial Pressure on Specialty Practices', date: 'March 3, 2026', tag: 'Cardiology' },
  { title: 'Physician Consolidation Model Faces Pressure, Raising Revenue Cycle Concerns for Specialty Practices and ASCs', date: 'February 24, 2026', tag: 'Industry Trends' },
  { title: 'Discharge Gaps in Addiction Treatment Create Revenue Cycle Vulnerabilities for Hospitals and Behavioral Health Providers', date: 'February 17, 2026', tag: 'Behavioral Health' },
  { title: 'Orthopedic Practices Adapt to Rising Patient Financial Responsibility', date: 'February 10, 2026', tag: 'Orthopedics' },
  { title: 'CMS Proposes Major Changes to Prior Authorization Requirements', date: 'February 3, 2026', tag: 'CMS Policy' },
  { title: 'AI-Driven Revenue Cycle Management Shows Measurable Impact Across Specialty Practices', date: 'January 27, 2026', tag: 'AI & Technology' },
  { title: 'Pain Management Coding Updates for 2026: What Practices Need to Know', date: 'January 20, 2026', tag: 'Pain Management' },
]

export default function NewsPage() {
  return (
    <main>
      <PageHero
        label="NEWS"
        title="Industry News & Updates"
        subtitle="Stay informed with the latest healthcare RCM news, policy updates, and industry insights curated by the Cosentus team."
      />

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {newsItems.map((news, i) => (
              <RevealOnScroll key={i} delay={Math.min(i * 0.05, 0.4)}>
                <article style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: 24,
                  padding: '28px 0',
                  borderBottom: '1px solid var(--gray-200)',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', fontWeight: 400 }}>
                    {news.date}
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: 'var(--primary-ghost)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 8,
                    }}>{news.tag}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 400, color: 'var(--gray-900)', lineHeight: 1.5 }}>
                      {news.title}
                    </h3>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--gray-400)" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
