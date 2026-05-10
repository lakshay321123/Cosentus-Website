import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const partners = [
  { name: 'Physician Side Gigs', src: '/images/partners/physician-side-gigs.png', width: 200, height: 75 },
  { name: 'TASCS', src: '/images/partners/tascs.png', width: 220, height: 70 },
  { name: 'American Society of Anesthesiologists', src: '/images/partners/asa.png', width: 180, height: 110 },
  { name: 'ASCA', src: '/images/partners/asca.png', width: 200, height: 110 },
  { name: 'HaloMD', src: '/images/partners/halomd.png', width: 200, height: 75 },
  { name: 'Graphium Health', src: '/images/partners/graphium.png', width: 200, height: 62 },
  { name: 'Rivet', src: '/images/partners/rivet.svg', width: 180, height: 60 },
  { name: 'Cisco', src: '/images/partners/cisco.png', width: 140, height: 100 },
  { name: 'VMware', src: '/images/partners/vmware.png', width: 180, height: 50 },
  { name: 'Datto', src: '/images/partners/datto.png', width: 140, height: 60 },
  { name: 'Microsoft', src: '/images/partners/microsoft.png', width: 200, height: 50 },
  { name: 'Dell', src: '/images/partners/dell.png', width: 100, height: 100 },
  { name: 'HP', src: '/images/partners/hp.png', width: 100, height: 100 },
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
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: '#000' }}>Our Network</div>
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
