'use client'

import { useState } from 'react'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const blogs = [
  { title: 'Transforming Episode Accountability Model (TEAM): The Future of Value-Based Care', excerpt: 'In recent years, the U.S. healthcare system has increasingly shifted toward value-based care models that prioritize patient outcomes over volume of services.', href: 'https://cosentus.com/transforming-episode-accountability-model-team/', tag: 'Value-Based Care' },
  { title: 'Safeguard Your Practice From Cyberattacks', excerpt: 'In the era of digital technology, the healthcare industry faces growing cybersecurity threats that can compromise patient data and disrupt operations.', href: 'https://cosentus.com/safeguard-your-practice-from-cyberattacks/', tag: 'Cybersecurity' },
  { title: 'Leverage RPM & RTM In Your Telehealth Model', excerpt: 'Offering telehealth services to patients now makes up a significant portion of healthcare delivery. Learn how Remote Patient Monitoring and Remote Therapeutic Monitoring can boost revenue.', href: 'https://cosentus.com/leverage-rpm-rtm-in-your-telehealth-model/', tag: 'Telehealth' },
  { title: 'Revenue Growth Strategies In Pain Management', excerpt: "Running a successful pain management practice isn't just about delivering exceptional patient care — it requires strategic revenue cycle management.", href: 'https://cosentus.com/revenue-growth-strategies-in-pain-management/', tag: 'Pain Management' },
  { title: 'Strategies To Handle Interoperability Challenges', excerpt: 'Being in the healthcare industry, we know how crucial seamless data exchange is between systems. Explore strategies to overcome interoperability challenges.', href: 'https://cosentus.com/strategies-to-handle-interoperability-challenges/', tag: 'Technology' },
  { title: 'Final Rule Against Injustice Disguised as Paper Work', excerpt: 'For healthcare providers, prior authorization is an absolute necessity but has long been a source of administrative burden. The new CMS final rule aims to change that.', href: 'https://cosentus.com/final-rule-against-injustice-disguised-as-paper-work/', tag: 'Compliance' },
  { title: 'How to Turn CMS Rule into Real Revenue Boost for Ortho ASC', excerpt: 'A new update from CMS — The Centers for Medicare & Medicaid Services has introduced changes that could significantly impact orthopedic ASCs.', href: 'https://cosentus.com/how-to-turn-cms-rule-into-real-revenue-boost-for-ortho-asc/', tag: 'ASC' },
  { title: 'AI in Medical Billing', excerpt: 'The past few decades have been marked by the rapid integration of artificial intelligence across industries. Healthcare revenue cycle management is no exception.', href: 'https://cosentus.com/integration-of-ai-in-healthcare-rcm/', tag: 'AI & Technology' },
  { title: 'The Ultimate Cardiology Medical Billing Guide', excerpt: "Today's healthcare organizations need to ensure every aspect of their revenue cycle is optimized. Cardiology billing presents unique challenges.", href: 'https://cosentus.com/cardiology-billing-guide-for-healthcare-practices/', tag: 'Billing' },
  { title: 'Ambulatory Surgery Center (ASC) Billing Guidelines', excerpt: 'The healthcare industry plays a crucial role in our society, and ASCs are becoming an increasingly important part of the delivery system.', href: 'https://cosentus.com/asc-billing-guide-for-healthcare-practices/', tag: 'ASC' },
  { title: "What Is Charge Capture? A Physician's Guide", excerpt: 'Charge capture is a critical component of the revenue cycle that directly impacts your bottom line. Learn what it is, why it matters, and how to optimize it.', href: 'https://cosentus.com/charge-capture-for-healthcare-practices/', tag: 'Billing' },
  { title: 'RCM Strategies for Community Health Centers', excerpt: 'Community health centers face unique revenue cycle challenges including complex payer mixes, sliding fee scales, and regulatory requirements.', href: 'https://cosentus.com/blog/', tag: 'RCM Strategy' },
  { title: 'Medical Billing Errors: How to Avoid Costly Mistakes', excerpt: 'Medical billing errors can cost practices thousands of dollars annually in lost revenue, compliance penalties, and patient dissatisfaction.', href: 'https://cosentus.com/blog/', tag: 'Billing' },
  { title: 'The Complete Guide to Denial Management', excerpt: 'Denial management is one of the most impactful areas of revenue cycle management. A proactive approach can recover significant revenue.', href: 'https://cosentus.com/blog/', tag: 'Denial Management' },
  { title: 'Understanding E/M Coding Changes', excerpt: 'Evaluation and Management coding underwent significant changes. Understanding these updates is critical for accurate reimbursement.', href: 'https://cosentus.com/blog/', tag: 'Coding' },
  { title: 'Patient Financial Experience: The New Frontier', excerpt: 'As patients bear more financial responsibility for their healthcare, the patient financial experience has become a critical differentiator.', href: 'https://cosentus.com/blog/', tag: 'Patient Experience' },
]

const allTags = ['All', ...Array.from(new Set(blogs.map(b => b.tag))).sort()]

export default function BlogContent() {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All' ? blogs : blogs.filter(b => b.tag === activeTag)

  return (
    <>
      {/* Tag Filters */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <RevealOnScroll>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: '8px 18px',
                    background: activeTag === tag ? 'var(--primary)' : 'var(--white)',
                    color: activeTag === tag ? 'white' : 'var(--gray-600)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontWeight: activeTag === tag ? 500 : 400,
                    border: `1px solid ${activeTag === tag ? 'var(--primary)' : 'var(--gray-200)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {filtered.map((blog, i) => (
              <a
                key={blog.title}
                href={blog.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
              >
                <article style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  overflow: 'hidden',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}>
                  <div style={{ height: 4, background: 'var(--primary)' }} />
                  <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'var(--primary-ghost)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 16,
                      alignSelf: 'flex-start',
                    }}>{blog.tag}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 500, color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: 12 }}>
                      {blog.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
                      {blog.excerpt}
                    </p>
                    <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 400, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 60, fontSize: 16 }}>
              No articles found for this category.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
