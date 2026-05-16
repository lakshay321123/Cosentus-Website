'use client'

// Hero specialty pills (Anesthesia / Orthopedics / Pain Management /
// ASCs / Behavioral Health / Multi-Specialty) used to live here as a
// 3-column glass-pill grid beneath the H1. They have been removed per
// user direction: specialties get their own dedicated section lower
// on the home page. The data + Link rendering moved to
// SpecialtiesSection.tsx.

export default function HeroSection() {
  // Hero no longer renders its own <video>. ImmersiveVideoBackground
  // now serves the page-level video for both desktop AND mobile
  // (mobile uses /images/hero-video-mobile.mp4 at native portrait
  // orientation). Removing the local video also fixes the
  // hidden-but-still-decoding issue flagged in coderabbit review of
  // PR #135.
  //
  // The .hero-overlay gradient div below was previously hidden on
  // desktop because ImmersiveVideoBackground draws its own page-wide
  // gradient overlay. Mobile used to keep this overlay because the
  // hero video lived inside the hero element. Now that the immersive
  // video covers mobile too, the overlay is redundant everywhere —
  // the CSS at the bottom of this file hides it universally.

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,53,69,0.75) 0%, rgba(0,89,110,0.55) 40%, rgba(0,181,214,0.3) 100%)', zIndex: 1 }} />
      </div>

      <div className="hero-content">
        <h1>
          Purpose Built<br />For Your Specialty<br /><span className="accent">Real People + AI.</span><br />RCM Redefined.
        </h1>
      </div>

      <style>{`
        /* The hero's own gradient overlay is now redundant on every
           viewport because ImmersiveVideoBackground draws a page-wide
           overlay. Hidden everywhere. */
        .hero-overlay {
          display: none;
        }
      `}</style>
    </section>
  )
}
