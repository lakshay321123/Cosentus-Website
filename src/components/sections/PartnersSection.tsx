import RevealOnScroll from '@/components/ui/RevealOnScroll'

const partners = [
  { name: 'ASCA', full: 'Ambulatory Surgery Center Association' },
  { name: 'HIMSS', full: 'Healthcare Information & Management Systems Society' },
  { name: 'ASA', full: 'American Society of Anesthesiologists' },
  { name: 'UCA', full: 'Urgent Care Association' },
  { name: 'CDA', full: 'California Dental Association' },
]

export default function PartnersSection() {
  return (
    <section style={{ padding: '48px 0', borderTop: '1px solid var(--gray-200)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--gray-400)' }}>Our Partners</div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(24px, 5vw, 64px)',
            flexWrap: 'wrap' as const,
          }}>
            {partners.map((p, i) => (
              <div key={i} style={{
                fontSize: 'clamp(16px, 2vw, 22px)',
                fontWeight: 700,
                color: 'var(--gray-300)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
                transition: 'color 0.3s ease',
                cursor: 'default',
              }}
              title={p.full}
              className="partner-logo-text"
              >
                {p.name}
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
