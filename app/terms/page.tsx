import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Terms & Conditions | Cosentus' }

const h3Style = { fontSize: 20, fontWeight: 500 as const, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }
const strongStyle = { color: 'var(--gray-900)' }

export default function TermsPage() {
  return (
    <main>
      <PageHero title="Terms & Conditions" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-700)' }}>

            <p>Welcome to our website. This site is maintained as a service to our customers. By using this site, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms and conditions carefully. If you do not agree to these terms and conditions, you should not use this site.</p>

            <h3 style={h3Style}>Agreement</h3>
            <p>This Term of Use agreement (the &ldquo;Agreement&rdquo;) specifies the Terms and Conditions for access to and use of https://cosentus.com/ (the &ldquo;Site&rdquo;) and describe the terms and conditions applicable to your access of and use of the Site. This Agreement may be modified at any time by Cosentus, LLC upon posting of the modified Agreement. Any such modifications shall be effective immediately. You can view the most recent version of these terms at any time at https://cosentus.com/. Each use by you shall constitute and be deemed your unconditional acceptance of this Agreement.</p>

            <h3 style={h3Style}>Privacy</h3>
            <p>Your visit to our site is also governed by our <a href="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</a>. Please review our Privacy Policy.</p>

            <h3 style={h3Style}>Ownership</h3>
            <p>All content included on this site is and shall continue to be the property of Cosentus, LLC or its content suppliers and is protected under applicable copyright, patent, trademark, and other proprietary rights. Any copying, redistribution, use or publication by you of any such content or any part of the Site is prohibited, except as expressly permitted in this Agreement. Under no circumstances will you acquire any ownership rights or other interest in any content by or through your use of this Site.</p>

            <h3 style={h3Style}>Intended Audience</h3>
            <p>This website is intended for adults only. This website is not intended for any children under the age of 13.</p>

            <h3 style={h3Style}>Trademarks</h3>
            <p>Cosentus, Cosentus Business Services, and others are either trademarks or registered trademarks of Cosentus, LLC. Other product and company names mentioned on this Site may be trademarks of their respective owners.</p>

            <h3 style={h3Style}>Site Use</h3>
            <p>Cosentus, LLC grants you a limited, revocable, nonexclusive license to use this site solely for your own personal use and not for republication, distribution, assignment, sublicense, sale, preparation of derivative works, or other use. You agree not to copy materials on the site, reverse engineer or break into the site, or use materials, products or services in violation of any law. The use of this website is at the discretion of Cosentus, LLC and Cosentus, LLC may terminate your use of this website at any time.</p>

            <h3 style={h3Style}>Compliance with Laws</h3>
            <p>You agree to comply with all applicable laws regarding your use of the website. You further agreed that information provided by you is truthful and accurate to the best of your knowledge.</p>

            <h3 style={h3Style}>Indemnification</h3>
            <p>You agree to indemnify, defend and hold Cosentus, LLC and our partners, employees, and affiliates, harmless from any liability, loss, claim and expense, including reasonable attorney&apos;s fees, related to your violation of this Agreement or use of the Site.</p>

            <h3 style={h3Style}>Disclaimer</h3>
            <p style={{ textTransform: 'uppercase' as const, fontSize: 13 }}>The information on this site is provided on an &ldquo;as is,&rdquo; &ldquo;as available&rdquo; basis. You agree that use of this site is at your sole risk. Cosentus, LLC disclaims all warranties of any kind, including but not limited to any express warranties, statutory warranties, and any implied warranties of merchantability, fitness for a particular purpose, and non-infringement. To the extent your jurisdiction does not allow limitations on warranties, this limitation may not apply to you. Your sole and exclusive remedy relating to your use of the site shall be to discontinue using the site.</p>

            <h3 style={h3Style}>Limitation of Liability</h3>
            <p style={{ textTransform: 'uppercase' as const, fontSize: 13 }}>Under no circumstances will Cosentus, LLC be liable or responsible for any direct, indirect, incidental, consequential (including damages from loss of business, lost profits, litigation, or the like), special, exemplary, punitive, or other damages, under any legal theory, arising out of or in any way relating to the site, your site use, or the content, even if advised of the possibility of such damages. Your sole remedy for dissatisfaction with the site and/or content is to cease all of your site use.</p>
            <p>You may have additional rights under certain laws (including consumer laws) which do not allow the exclusion of implied warranties, or the exclusion or limitation of certain damages. If these laws apply to you, the exclusions or limitations in this Agreement that directly conflict with such laws may not apply to you.</p>

            <h3 style={h3Style}>Use of Information</h3>
            <p>Cosentus, LLC reserves the right, and you authorize us, to use and assign all information regarding site uses by you and all information provided by you in any manner consistent with our Privacy Policy.</p>

            <h3 style={h3Style}>Copyrights and Copyright Agent</h3>
            <p>If you believe your work has been copied in a way that constitutes copyright infringement, or your intellectual property rights have otherwise been violated, please provide a notice containing all of the following information to our Copyright Agent:</p>
            <p>(a) An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;</p>
            <p>(b) A description of the copyrighted work that you claim has been infringed;</p>
            <p>(c) A description of where the material that you claim is infringing is located on the Site;</p>
            <p>(d) Your address, telephone number, and e-mail address;</p>
            <p>(e) A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and</p>
            <p>(f) A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner&apos;s behalf.</p>

            <h3 style={h3Style}>Applicable Law</h3>
            <p>You agree that the laws of the state of California, United States of America, without regard to conflicts of laws provisions will govern these Terms and Condition of Use and any dispute that may arise between you and Cosentus, LLC or its affiliates.</p>

            <h3 style={h3Style}>Severability</h3>
            <p>If any provision of this Agreement shall be adjudged by any court of competent jurisdiction to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement will otherwise remain in full force and effect.</p>

            <h3 style={h3Style}>Waiver</h3>
            <p>The failure of Cosentus, LLC to exercise or enforce any right or provision of this Agreement shall not operate as a waiver of such right or provision. Any waiver of this Agreement by Cosentus, LLC must be in writing and signed by an authorized representative of Cosentus, LLC.</p>

            <h3 style={h3Style}>Termination</h3>
            <p>Cosentus, LLC may terminate this Agreement at any time, with or without notice, for any reason.</p>

            <h3 style={h3Style}>Relationship of the Parties</h3>
            <p>Nothing contained in this Agreement or your use of the Site shall be construed to constitute either party as a partner, joint venturer, employee or agent of the other party, nor shall either party hold itself out as such. Neither party has any right or authority to incur, assume or create, in writing or otherwise, any warranty, liability or other obligation of any kind, express or implied, in the name of or on behalf of the other party, it being intended by both parties that each shall remain independent contractors responsible for its own actions.</p>

            <h3 style={h3Style}>Entire Agreement</h3>
            <p>This Terms of Use constitutes the entire agreement between you and Cosentus, LLC and governs the terms and conditions of your use of the Site, and supersedes all prior or contemporaneous communications and proposals, whether electronic, oral or written, between you and Cosentus, LLC with respect to this Site. Notwithstanding the foregoing, you may also be subject to additional terms and conditions, posted policies (including but not limited to the Privacy Policy), guidelines, or rules that may apply when you use the website. Cosentus, LLC may revise this Terms of Use at any time by updating this Agreement and posting it on the Site. Accordingly, you should visit the Site and review the Terms of Use periodically to determine if any changes have been made. Your continued use of this website after any changes have been made to the Terms of Use signifies and confirms your acceptance of any such changes or amendments to the Terms of Use.</p>

            <h3 style={h3Style}>Contact Information</h3>
            <div style={{ marginTop: 16, padding: '20px 24px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
              <strong style={strongStyle}>Cosentus, LLC</strong><br />
              300 Spectrum Center Drive, Suite 1450<br />
              Irvine, CA 92618<br />
              (949) 506-4185<br />
              <a href="mailto:wecare@cosentus.com" style={{ color: 'var(--primary)' }}>wecare@cosentus.com</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
