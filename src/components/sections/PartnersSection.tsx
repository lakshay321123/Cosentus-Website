import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const partners = [
  { name: 'ASCA', src: '/images/11-300x173.png', width: 140, height: 80 },
  { name: 'ASA', src: '/images/06-300x190.png', width: 130, height: 82 },
  { name: 'UCA', src: '/images/09-300x231.png', width: 120, height: 92 },
  { name: 'Global Chamber', src: '/images/03-300x295.png', width: 100, height: 98 },
  { name: 'NJ AASC', src: '/images/05-300x169.png', width: 140, height: 79 },
  { name: 'AWS', src: '/images/aws-partner-logo.svg', width: 140, height: 79 },
]

function PartnerLogo({ p }: { p: typeof partners[0] }) {
  return (
    <div style={{ opacity: 0.55, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 50 }} className="partner-logo">
      <Image src={p.src} alt={p.name} width={p.width} height={p.height} style={{ objectFit: 'contain', maxHeight: 50, width: 'auto', maxWidth: 110 }} />
    </div>
  )
}

export default function PartnersSection() {
  return (
    <section style={{ padding: '48px 0', borderTop: '1px solid var(--gray-200)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--gray-400)' }}>Our Partners</div>
          </div>
        </RevealOnScroll>

        {/* Desktop */}
        <div className="partners-desktop" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 'clamp(28px, 5vw, 56px)', flexWrap: 'wrap' as const,
        }}>
          {partners.map((p, i) => <PartnerLogo key={i} p={p} />)}
        </div>

        {/* Mobile, scrolling marquee */}
        <div className="partners-mobile" style={{ overflow: 'hidden', width: '100%' }}>
          <div className="partners-marquee">
            {[...partners, ...partners].map((p, i) => <PartnerLogo key={i} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
