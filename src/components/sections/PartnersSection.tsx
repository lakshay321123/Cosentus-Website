import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const partners = [
  { name: 'Physician Side Gigs', src: '/images/partners/physician-side-gigs.png', width: 80, height: 80 },
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
    <div style={{ opacity: 0.85, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 50 }} className="partner-logo">
      <Image
        src={p.src}
        alt={p.name}
        width={p.width}
        height={p.height}
        style={{
          objectFit: 'contain',
          maxHeight: 50,
          width: 'auto',
          maxWidth: 110,
          // brightness(0) collapses every color to black, invert(1) flips
          // black to white -> every logo renders as a pure-white silhouette.
          // Tradeoff: any internal multi-color detail (gradients, brand
          // colors) is flattened. Acceptable because this section is a
          // "wall of recognition" marquee, not for close inspection.
          filter: 'brightness(0) invert(1)',
        }}
      />
    </div>
  )
}

export default function PartnersSection() {
  return (
    <section style={{ padding: '48px 0', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'left', marginBottom: 40 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'rgba(255, 255, 255, 0.95)' }}>Our <span className="accent">Network</span></div>
          </div>
        </RevealOnScroll>

        {/* Single-row marquee for all viewports */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="partners-marquee">
            {[...partners, ...partners].map((p, i) => <PartnerLogo key={i} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
