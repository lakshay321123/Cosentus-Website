import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Terms & Conditions | Cosentus' }

export default function TermsPage() {
  return (
    <main>
      <PageHero title="Terms & Conditions" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="legal-content" style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-700)' }}>

            <p>Welcome to our website. This site is maintained as a service to our customers. By using this site, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms and conditions carefully. If you do not agree to these terms and conditions, you should not use this site.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Agreement</h3>
            <p>This Terms of Use agreement (the &ldquo;Agreement&rdquo;) specifies the Terms and Conditions for access to and use of cosentus.com (the &ldquo;Site&rdquo;) and describes the terms and conditions applicable to your access and use of the Site. This Agreement may be modified at any time by Cosentus, LLC upon posting of the modified Agreement. Any such modifications shall be effective immediately.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Privacy</h3>
            <p>Your visit to our site is also governed by our <a href="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Ownership</h3>
            <p>All content included on this site is and shall continue to be the property of Cosentus, LLC or its content suppliers and is protected under applicable copyright, patent, trademark, and other proprietary rights. Any copying, redistribution, use or publication by you of any such content or any part of the Site is prohibited, except as expressly permitted in this Agreement.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Intended Audience</h3>
            <p>This website is intended for adults only. This website is not intended for any children under the age of 13.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Trademarks</h3>
            <p>Cosentus, Cosentus Business Services, and others are either trademarks or registered trademarks of Cosentus, LLC. Other product and company names mentioned on this Site may be trademarks of their respective owners.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Site Use</h3>
            <p>Cosentus, LLC grants you a limited, revocable, nonexclusive license to use this site solely for your own personal use and not for republication, distribution, assignment, sublicense, sale, preparation of derivative works, or other use. You agree not to copy materials on the site, reverse engineer or break into the site, or use materials, products or services in violation of any law.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Compliance with Laws</h3>
            <p>You agree to comply with all applicable laws regarding your use of the website. You further agree that information provided by you is truthful and accurate to the best of your knowledge.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Indemnification</h3>
            <p>You agree to indemnify, defend and hold Cosentus, LLC and our partners, employees, and affiliates, harmless from any liability, loss, claim and expense, including reasonable attorney&apos;s fees, related to your violation of this Agreement or use of the Site.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Disclaimer</h3>
            <p>THE INFORMATION ON THIS SITE IS PROVIDED ON AN &ldquo;AS IS,&rdquo; &ldquo;AS AVAILABLE&rdquo; BASIS. YOU AGREE THAT USE OF THIS SITE IS AT YOUR SOLE RISK. COSENTUS, LLC DISCLAIMS ALL WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO ANY EXPRESS WARRANTIES, STATUTORY WARRANTIES, AND ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Limitation of Liability</h3>
            <p>UNDER NO CIRCUMSTANCES WILL COSENTUS, LLC BE LIABLE OR RESPONSIBLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, PUNITIVE, OR OTHER DAMAGES, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN ANY WAY RELATING TO THE SITE, YOUR SITE USE, OR THE CONTENT, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Applicable Law</h3>
            <p>You agree that the laws of the state of California, United States of America, without regard to conflicts of laws provisions will govern these Terms and Conditions of Use and any dispute that may arise between you and Cosentus, LLC or its affiliates.</p>

            <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }}>Contact Information</h3>
            <p style={{ padding: '20px 24px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
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
