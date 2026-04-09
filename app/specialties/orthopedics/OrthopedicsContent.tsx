'use client'

import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const services = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>, title: 'Surgical & Procedural Coding', desc: 'Accurate CPT selection, modifier application, and documentation alignment for every orthopedic procedure.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Global Period Management', desc: 'Track global windows and capture separately billable post-op visits that other billers miss.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, title: "Workers' Compensation", desc: 'State- and payer-specific requirements handled for timely collection across all jurisdictions.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.25 5.25a2.121 2.121 0 01-3-3l5.25-5.25m7.5-3l-3.75 3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Implant & Device Billing', desc: 'Accurate pass-through processes to ensure implant reimbursement on every case.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>, title: 'Prior Authorization', desc: 'Olivia tracks and closes authorizations to keep OR schedules intact. Zero procedural delays.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>, title: 'Denial Management', desc: '95%+ appeal success. We appeal with clinical rationale and payer-specific strategies for high-dollar ortho denials.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: 'Reporting & Analytics', desc: 'Real-time dashboards showing collections by procedure, surgeon, payer, and facility.' },
]

const stats = [
  { value: '46%', label: 'Revenue Growth' },
  { value: '95%+', label: 'Appeal Success' },
  { value: '28', label: 'Day WC Turnaround' },
  { value: '$2.2M', label: 'From $1.5M' },
]

const testimonials = [
  { quote: 'Cosentus has been efficient, responsive, and personable in managing my revenue cycle. I have seen my revenue grow tremendously.', author: 'Dr. Jothi Murali-Larson', title: 'Orthopedic Surgeon' },
  { quote: 'My collections have significantly increased with their stewardship.', author: 'Dr. Samir and Kavita Sharma', title: 'South Bay Orthopedics' },
]

export default function OrthopedicsContent() {
  return (
    <>
      {/* Stats Bar - light, no black */}
      <section style={{ borderBottom: '1px solid var(--gray-200)', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {stats.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.15}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 300, color: '#00B5D6', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{s.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll><div className="section-label">THE CHALLENGE</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: 24, fontFamily: 'var(--font-display)' }}>High-Value Cases. Predictable Revenue Leakage.</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--gray-600)' }}>
              Incorrect modifier usage (59, XE, XS, XP), missed implant pass-throughs, global period miscalculations, and workers&apos; comp complexities. Our orthopedic billing leaders are surgical practice veterans. AI agents handle volume — freeing human coders for complex, high-dollar issues.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Services — with icons */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">WHAT WE MANAGE</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">Complete Orthopedic Revenue Cycle</div></RevealOnScroll>
          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.07}>
                <div className="advantage-card">
                  <div className="advantage-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4500}>
              {services.map((s, i) => (
                <div key={i} className="advantage-card">
                  <div className="advantage-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      {/* Alta */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll><div className="section-label">EXPANDED CAPABILITIES</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div style={{ padding: '28px 32px', background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', borderLeft: '4px solid #00B5D6' }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)', margin: 0 }}>
                <strong style={{ color: 'var(--gray-900)' }}>Alta Management Solutions</strong> — In May 2025, Cosentus acquired Alta, expanding orthopedic and multi-specialty surgical expertise, ASC management, and contract negotiation capabilities.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll><div className="section-label">CLIENT REVIEWS</div></RevealOnScroll>
          <RevealOnScroll delay={0.1}><div className="section-title">What Our Clients Say</div></RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 32, marginTop: 48 }}>
            {testimonials.map((t, i) => (
              <RevealOnScroll key={i} direction={i === 0 ? 'left' : 'right'} delay={0.2 + i * 0.15}>
                <div className="testimonial-card" style={{
                  padding: '40px 36px', background: 'var(--white)', borderRadius: 16,
                  border: '1px solid var(--gray-200)', position: 'relative', height: '100%',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  <div style={{ position: 'absolute', top: 20, left: 28, fontSize: 64, lineHeight: 1, color: 'var(--primary)', opacity: 0.12, fontFamily: 'Georgia, serif', fontWeight: 700 }}>&ldquo;</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>{t.author.split(' ').filter(w => w[0] === w[0].toUpperCase() && !w.includes('.')).map(w => w[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{t.author}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.title}</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
