import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Privacy Policy | Cosentus' }

export default function PrivacyPage() {
  return (
    <main>
      <PageHero title="Privacy Policy" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="legal-content" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-700)' }}>

            <p>We take your privacy very seriously. Please read this privacy policy carefully as it contains important information on who we are, how and why we collect, store, use, and share your personal information. It also explains your rights in relation to your personal information and how to contact us or supervisory authorities in the event you have a complaint.</p>

            <p>We collect, use and are responsible for certain personal information about you. When we do so we are subject to various laws in the United States and the General Data Protection Regulation which applies across the European Union (including in the United Kingdom), and we are responsible as &ldquo;controller&rdquo; of that personal information for the purposes of those laws.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>1. Key Terms</h3>
            <p><strong style={{ color: 'var(--gray-900)' }}>We, us, our:</strong> Cosentus, LLC, a Nevada limited liability company, a/k/a Cosentus Business Services, and affiliated companies.</p>
            <p><strong style={{ color: 'var(--gray-900)' }}>Personal information:</strong> Any information relating to an identified or identifiable individual.</p>
            <p><strong style={{ color: 'var(--gray-900)' }}>Special category personal information:</strong> Personal information revealing racial or ethnic origin, political opinions, religious beliefs, philosophical beliefs or trade union membership; genetic and biometric data; data concerning health, sex life or sexual orientation.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>2. Personal Information We Collect</h3>
            <p>We may collect and use personal information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked with a particular consumer or household, including: identifiers (name, address, email, SSN, etc.), financial information, characteristics of protected classifications, commercial information, biometric information, internet activity, geolocation data, professional information, and inferences drawn from the above.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>3. How Your Personal Information is Collected</h3>
            <p>We collect most of this personal information directly from you — in person, by telephone, text or email, or via our website. We may also collect information from our clients, from activity on our website, from third-parties, public sources, affiliates, referral partners, vendors, and social networks.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>4. How and Why We Use Your Personal Information</h3>
            <p>Under data protection law, we can only use your personal information if we have a proper reason, such as: to comply with legal and regulatory obligations; for the performance of our contract with you; for our legitimate interests; or where you have given consent. We use your information to provide products and services, prevent fraud, comply with regulations, conduct audits, improve efficiency, ensure security, and for marketing purposes.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>5. Promotional Communications</h3>
            <p>We may use your personal information to send you updates about our products and services. We will always treat your personal information with the utmost respect and never sell or share it with other organizations outside the Cosentus group for marketing purposes. You have the right to opt out at any time by contacting us at <a href="mailto:wecare@cosentus.com" style={{ color: 'var(--primary)' }}>wecare@cosentus.com</a> or using the &ldquo;unsubscribe&rdquo; link in emails.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>6. Who We Share Your Personal Information With</h3>
            <p>We routinely share personal information with our affiliates, service providers, third parties approved by you, credit reporting agencies, insurers, brokers, and banks. We only allow service providers to handle your personal information if we are satisfied they take appropriate measures to protect it.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>7. Personal Information Disclosed for Business Purposes</h3>
            <p style={{ fontWeight: 600, color: 'var(--gray-900)' }}>WE DO NOT, AND WILL NOT, SELL YOUR PERSONAL INFORMATION.</p>
            <p>In the preceding 12 months, we have disclosed for a business purpose to one or more third parties categories of personal information including identifiers, financial information, protected classifications, commercial information, biometric information, internet activity, geolocation data, professional information, and inferences.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>8–10. Storage, Retention & Transfers</h3>
            <p>Information may be held at our offices and those of our group companies, third party agencies, service providers, and agents. We will keep your personal information while you have an account with us or while we are providing services to you. For transfers outside the EEA, we use standard data protection contract clauses approved by the European Commission.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>11. Your Rights Under the GDPR</h3>
            <p>You have the right to: access your personal information; rectification of mistakes; erasure (&ldquo;right to be forgotten&rdquo;); restriction of processing; data portability; object to processing; and not be subject to automated decision-making.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>12. Your Rights Under the CCPA</h3>
            <p>Under the California Consumer Privacy Act, you have the right to know what personal information we collect, request deletion of your personal information, opt-out of disclosure, and protection against discrimination for exercising your rights.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>13. Keeping Your Personal Information Secure</h3>
            <p>We have appropriate security measures in place to prevent personal information from being accidentally lost or used or accessed in an unauthorized way. We limit access to those who have a genuine business need.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>14. How to Exercise Your Rights</h3>
            <p>Email us at <a href="mailto:wecare@cosentus.com" style={{ color: 'var(--primary)' }}>wecare@cosentus.com</a>. You will need to provide enough information to identify you, proof of identity and address, and a description of what right you want to exercise.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>15–18. Complaints, Changes & Contact</h3>
            <p>This privacy notice was last updated on January 21, 2022. We may change this privacy notice from time to time.</p>
            <p style={{ marginTop: 20, padding: '20px 24px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
              <strong style={{ color: 'var(--gray-900)' }}>Cosentus, LLC</strong><br />
              300 Spectrum Center Drive, Suite 1450<br />
              Irvine, CA 92618<br />
              <a href="mailto:wecare@cosentus.com" style={{ color: 'var(--primary)' }}>wecare@cosentus.com</a> | (949) 506-4185
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
