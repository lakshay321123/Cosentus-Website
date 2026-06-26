import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Privacy Policy | Cosentus', alternates: { canonical: '/privacy' } }

const h3Style = { fontSize: 20, fontWeight: 500 as const, color: 'var(--gray-900)', marginTop: 40, marginBottom: 12 }
const strongStyle = { color: 'var(--gray-900)' }

export default function PrivacyPage() {
  return (
    <main>
      <PageHero title="Privacy Policy" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--gray-700)' }}>

            <p>We take your privacy very seriously. Please read this privacy policy carefully as it contains important information on who we are, how and why we collect, store, use, and share your personal information. It also explains your rights in relation to your personal information and how to contact us or supervisory authorities in the event you have a complaint.</p>

            <p>We collect, use and are responsible for certain personal information about you. When we do so we are subject to various laws in the United States and the General Data Protection Regulation which applies across the European Union (including in the United Kingdom), and we are responsible as &ldquo;controller&rdquo; of that personal information for the purposes of those laws.</p>

            <h3 style={h3Style}>1. Key Terms</h3>
            <p>It would be helpful to start by explaining some key terms used in this policy:</p>
            <p><strong style={strongStyle}>We, us, our:</strong> Cosentus, LLC, a Nevada limited liability company, a/k/a Cosentus Business Services, and affiliated companies.</p>
            <p><strong style={strongStyle}>Personal information:</strong> Any information relating to an identified or identifiable individual.</p>
            <p><strong style={strongStyle}>Special category personal information:</strong> Personal information revealing racial or ethnic origin, political opinions, religious beliefs, philosophical beliefs or trade union membership; genetic and biometric data; data concerning health, sex life or sexual orientation.</p>

            <h3 style={h3Style}>2. Personal Information We Collect About You</h3>
            <p>We may collect and use the following personal information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or household:</p>
            <p><strong style={strongStyle}>Identifiers:</strong> A real name, alias, postal address, unique personal identifier, online identifier, Internet Protocol address, email address, account name, Social Security number, driver&apos;s license number, passport number, or other similar identifiers.</p>
            <p><strong style={strongStyle}>Personal records:</strong> A name, signature, Social Security number, physical characteristics or description, address, telephone number, passport number, driver&apos;s license or state identification card number, insurance policy number, education, employment, employment history, bank account number, credit card number, debit card number, or any other financial information, medical information, or health insurance information. Some personal information included in this category may overlap with other categories.</p>
            <p><strong style={strongStyle}>Protected classifications:</strong> Age (40 years or older), race, color, ancestry, national origin, citizenship, religion or creed, marital status, medical condition, physical or mental disability, sex (including gender, gender identity, gender expression, pregnancy or childbirth and related medical conditions), sexual orientation, veteran or military status, genetic information (including familial genetic information).</p>
            <p><strong style={strongStyle}>Commercial information:</strong> Records of personal property, products or services purchased, obtained, or considered, or other purchasing or consuming histories or tendencies.</p>
            <p><strong style={strongStyle}>Biometric information:</strong> Genetic, physiological, behavioral, and biological characteristics, or activity patterns used to extract a template or other identifier or identifying information, such as fingerprints.</p>
            <p><strong style={strongStyle}>Internet or electronic network activity:</strong> Browsing history, search history, information on a consumer&apos;s interaction with a website, application, or advertisement.</p>
            <p><strong style={strongStyle}>Geolocation data:</strong> Physical location or movements.</p>
            <p><strong style={strongStyle}>Audio, electronic, visual, thermal, olfactory, or similar information:</strong> Not collected.</p>
            <p><strong style={strongStyle}>Professional or employment-related information:</strong> Current or past job history or performance evaluations.</p>
            <p><strong style={strongStyle}>Education information:</strong> Not collected.</p>
            <p><strong style={strongStyle}>Inferences:</strong> Profile reflecting a person&apos;s preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes.</p>
            <p>This personal information is required to provide our products and services to you. If you do not provide personal information we ask for, it may delay or prevent us from providing our products and services to you.</p>

            <h3 style={h3Style}>3. How Your Personal Information is Collected</h3>
            <p>We collect most of this personal information directly from you\u2014in person, by telephone, text or email, or via our website. However, we may also collect information:</p>
            <p>Directly from our clients, prospects or employees. For example, from documents that our clients provide to us related to the services for which they engage us.</p>
            <p>Indirectly from our clients, prospects or their employees. For example, through information we collect from our clients in the course of providing services to them.</p>
            <p>Directly and indirectly from activity on our website (https://cosentus.com/) or other portals. For example, from submissions through our website or website usage details collected automatically.</p>
            <p>From third-parties that interact with us in connection with the services we provide. For example, from government agencies when we verify data associated with payroll processing and withholding tax payments.</p>
            <p>We may also collect personal information about you from other categories of sources such as: our affiliates; our other clients; public and publicly available sources; our third-party referral partners, vendors, data suppliers and service providers; partners with which we offer co-branded services or engage in joint event or marketing activities; social networks; news outlets and related media; and organizations with which you are employed or affiliated.</p>

            <h3 style={h3Style}>4. How and Why We Use Your Personal Information</h3>
            <p>Under data protection law, we can only use your personal information if we have a proper reason for doing so, e.g.:</p>
            <p>To comply with our legal and regulatory obligations; for the performance of our contract with you or to take steps at your request before entering into a contract; for our legitimate interests or those of a third party; or where you have given consent.</p>
            <p>A legitimate interest is when we have a business or commercial reason to use your information, so long as this is not overridden by your own rights and interests.</p>
            <p>We use your personal information to: provide our products and services to you; prevent and detect fraud against you or us; conduct checks to identify our customers and verify their identity; screen for financial and other sanctions or embargoes; comply with professional, legal and regulatory obligations; gather and provide information required by or relating to audits, enquiries or investigations by regulatory bodies; ensure business policies are adhered to; improve efficiency, training and quality control; ensure the confidentiality of commercially sensitive information; perform statistical analysis to help us manage our business; prevent unauthorized access and modifications to systems; update and enhance customer records; complete statutory returns; ensure safe working practices, staff administration and assessments; market our services; perform credit reference checks via external credit reference agencies; and complete external audits and quality checks.</p>

            <h3 style={h3Style}>5. Promotional Communications</h3>
            <p>We may use your personal information to send you updates (by email, text message, telephone or post) about our products and services, including exclusive offers, promotions or new products and services.</p>
            <p>We have a legitimate interest in processing your personal information for promotional purposes. This means we do not usually need your consent to send you promotional communications. However, where consent is needed, we will ask for this consent separately and clearly.</p>
            <p>We will always treat your personal information with the utmost respect and never sell or share it with other organizations outside the Cosentus group for marketing purposes.</p>
            <p>You have the right to opt out of receiving promotional communications at any time by: contacting us at <a href="mailto:sales@cosentus.com" style={{ color: 'var(--primary)' }}>sales@cosentus.com</a>; using the &ldquo;unsubscribe&rdquo; link in emails or &ldquo;STOP&rdquo; number in texts.</p>
            <p>We may ask you to confirm or update your marketing preferences if you instruct us to provide further products and services in the future, or if there are changes in the law, regulation, or the structure of our business.</p>

            <h3 style={h3Style}>6. Who We Share Your Personal Information With</h3>
            <p>We routinely share personal information with: our affiliates, including companies within the Cosentus group; service providers we use to help deliver our products and services to you, such as payment service providers, warehouses and delivery companies; other third parties we use to help us run our business, such as marketing agencies or website hosts; third parties approved by you, including social media sites you choose to link your account to or third-party payment providers; credit reporting agencies; our insurers and brokers; our banks.</p>
            <p>We only allow our service providers to handle your personal information if we are satisfied they take appropriate measures to protect your personal information. We also impose contractual obligations on service providers relating to ensure they can only use your personal information to provide services to us and to you. We may also share personal information with external auditors, e.g. in relation to ISO accreditation and the audit of our accounts.</p>
            <p>We may disclose and exchange information with law enforcement agencies and regulatory bodies to comply with our legal and regulatory obligations.</p>
            <p>We may also need to share some personal information with other parties, such as potential buyers of some or all of our business or during a re-structuring. We will typically anonymize information, but this may not always be possible. The recipient of the information will be bound by confidentiality obligations.</p>

            <h3 style={h3Style}>7. Personal Information We Disclosed for a Business Purpose</h3>
            <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 16 }}>WE DO NOT, AND WILL NOT, SELL YOUR PERSONAL INFORMATION.</p>
            <p>In the preceding 12 months, we have disclosed for a business purpose to one or more third parties the following categories of personal information: identifiers; information that identifies, relates to, describes, or is capable of being associated with a particular individual; characteristics of protected classifications under California or federal law; commercial information; biometric information; internet or other electronic network activity information; geolocation data; professional or employment-related information; and inferences drawn from any of the information identified above to create a profile about a consumer.</p>

            <h3 style={h3Style}>8. Where Your Personal Information is Held</h3>
            <p>Information may be held at our offices and those of our group companies, third party agencies, service providers, representatives and agents as described above. Some of these third parties may be based outside the European Economic Area. For more information, including on how we safeguard your personal information when this occurs, see below: &ldquo;Transferring Your Personal Information Out of the EEA&rdquo;.</p>

            <h3 style={h3Style}>9. How Long Your Personal Information Will Be Kept</h3>
            <p>We will keep your personal information while you have an account with us or while we are providing our products and services to you. Thereafter, we will keep your personal information for as long as is necessary: to respond to any questions, complaints or claims made by you or on your behalf; to show that we treated you fairly; or to keep records required by law. We will not retain your personal information for longer than necessary for the purposes set out in this policy. Different retention periods apply for different types of personal information. Further details on this are available upon request.</p>

            <h3 style={h3Style}>10. Transferring Your Personal Information Out of the EEA</h3>
            <p>To deliver services to you, it is sometimes necessary for us to share your personal information outside the European Economic Area (EEA), e.g.: with our offices outside the EEA; with your and our service providers located outside the EEA; if you are based outside the EEA; or where there is an international dimension to the services we are providing to you.</p>
            <p>These transfers are subject to special rules under European and UK data protection law. These non-EEA countries do not have the same data protection laws as the United Kingdom and EEA: United States of America.</p>
            <p>We will, however, ensure the transfer complies with data protection law and all personal information will be secure. Our standard practice is to use standard data protection contract clauses that have been approved by the European Commission. To obtain a copy of those clauses please contact us.</p>

            <h3 style={h3Style}>11. Your Rights Under the GDPR</h3>
            <p><strong style={strongStyle}>Right to Access:</strong> The right to be provided with a copy of your personal information (the right of access).</p>
            <p><strong style={strongStyle}>Right to Rectification:</strong> The right to require us to correct any mistakes in your personal information.</p>
            <p><strong style={strongStyle}>Right to be Forgotten:</strong> The right to require us to delete your personal information\u2014in certain situations.</p>
            <p><strong style={strongStyle}>Right to Restriction of Processing:</strong> The right to require us to restrict processing of your personal information\u2014in certain circumstances, e.g. if you contest the accuracy of the data.</p>
            <p><strong style={strongStyle}>Right to Data Portability:</strong> The right to receive the personal information you provided to us, in a structured, commonly used and machine-readable format and/or transmit that data to a third party\u2014in certain situations.</p>
            <p><strong style={strongStyle}>Right to Object:</strong> The right to object: at any time to your personal information being processed for direct marketing (including profiling); in certain other situations to our continued processing of your personal information, e.g. processing carried out for the purpose of our legitimate interests.</p>
            <p><strong style={strongStyle}>Right Not to be Subject to Automated Individual Decision-Making:</strong> The right not to be subject to a decision based solely on automated processing (including profiling) that produces legal effects concerning you or similarly significantly affects you.</p>
            <p>For further information on each of those rights, including the circumstances in which they apply, see the guidance from the UK Information Commissioner&apos;s Office (ICO) on individual rights under the General Data Protection Regulation.</p>

            <h3 style={h3Style}>12. Your Rights Under the CCPA</h3>
            <p>You have the right under the California Consumer Privacy Act of 2018 (CCPA) and certain other privacy and data protection laws, as applicable, to exercise free of charge:</p>
            <p><strong style={strongStyle}>Disclosure of Personal Information We Collect About You:</strong> You have the right to know: the categories of personal information we have collected about you; the categories of sources from which the personal information is collected; our business or commercial purpose for collecting or selling personal information; the categories of third parties with whom we share personal information, if any; and the specific pieces of personal information we have collected about you. Please note that we are not required to: retain any personal information about you that was collected for a single one-time transaction if, in the ordinary course of business, that information about you is not retained; reidentify or otherwise link any data that, in the ordinary course of business, is not maintained in a manner that would be considered personal information; or provide the personal information to you more than twice in a 12-month period.</p>
            <p><strong style={strongStyle}>Personal Information Sold or Used for a Business Purpose:</strong> In connection with any personal information we may sell or disclose to a third party for a business purpose, you have the right to know: the categories of personal information about you that we sold and the categories of third parties to whom the personal information was sold; and the categories of personal information that we disclosed about you for a business purpose. You have the right to opt-out of the disclosure of your personal information. If you exercise your right to opt-out, we will refrain from selling your personal information, unless you subsequently provide express authorization for the sale of your personal information.</p>
            <p><strong style={strongStyle}>Right to Deletion:</strong> Subject to certain exceptions, on receipt of a verifiable request from you, we will: delete your personal information from our records; and direct any service providers to delete your personal information from their records. Please note that we may not delete your personal information if it is necessary to: complete the transaction for which the personal information was collected, fulfill the terms of a written warranty or product recall, provide a good or service requested by you, or otherwise perform a contract between you and us; detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity; or prosecute those responsible for that activity; debug to identify and repair errors that impair existing intended functionality; exercise free speech, ensure the right of another consumer to exercise his or her right of free speech, or exercise another right provided for by law; comply with the California Electronic Communications Privacy Act; engage in public or peer-reviewed scientific, historical, or statistical research in the public interest; enable solely internal uses that are reasonably aligned with your expectations based on your relationship with us; comply with an existing legal obligation; or otherwise use your personal information, internally, in a lawful manner that is compatible with the context in which you provided the information.</p>
            <p><strong style={strongStyle}>Protection Against Discrimination:</strong> You have the right to not be discriminated against by us because you exercised any of your rights under the CCPA. This means we cannot, among other things: deny goods or services to you; charge different prices or rates for goods or services, including through the use of discounts or other benefits or imposing penalties; provide a different level or quality of goods or services to you; or suggest that you will receive a different price or rate for goods or services or a different level or quality of goods or services. Please note that we may charge a different price or rate or provide a different level or quality of goods and/or services to you, if that difference is reasonably related to the value provided to our business by your personal information.</p>

            <h3 style={h3Style}>13. Keeping Your Personal Information Secure</h3>
            <p>We have appropriate security measures in place to prevent personal information from being accidentally lost or used or accessed in an unauthorized way. We limit access to your personal information to those who have a genuine business need to access it. Those processing your information will do so only in an authorized manner and are subject to a duty of confidentiality. We also have procedures in place to deal with any suspected data security breach. We will notify you and any applicable regulator of a suspected data security breach where we are legally required to do so.</p>

            <h3 style={h3Style}>14. How to Exercise Your Rights</h3>
            <p>If you would like to exercise any of your rights as described in this Privacy Policy, please email us at <a href="mailto:sales@cosentus.com" style={{ color: 'var(--primary)' }}>sales@cosentus.com</a>.</p>
            <p>Please note that you may only make a CCPA-related data access or data portability disclosure request twice within a 12-month period. If you choose to contact us directly by website/email, you will need to provide us with: enough information to identify you; proof of your identity and address (e.g., a copy of your driving license or passport and a recent utility or credit card bill); and a description of what right you want to exercise and the information to which your request relates.</p>
            <p>We are not obligated to make a data access or data portability disclosure if we cannot verify that the person making the request is the person about whom we collected information, or is someone authorized to act on such person&apos;s behalf. Any personal information we collect from you to verify your identity in connection with your request will be used solely for the purposes of verification.</p>

            <h3 style={h3Style}>15. How to File a GDPR Complaint</h3>
            <p>We hope that we can resolve any query or concern you raise about our use of your information. The General Data Protection Regulation also gives you right to lodge a complaint with a supervisory authority, in the European Union (or European Economic Area) state where you work, normally live, or where any alleged infringement of data protection laws occurred.</p>

            <h3 style={h3Style}>16. Changes to This Privacy Notice</h3>
            <p>This privacy notice was published on January 21, 2022 and last updated on January 21, 2022. We may change this privacy notice from time to time\u2014when we do, we will inform you via our website or other means of contact such as email.</p>

            <h3 style={h3Style}>17. How to Contact Us</h3>
            <p>Please contact us by post, email or telephone if you have any questions about this privacy policy or the information we hold about you.</p>
            <div style={{ marginTop: 16, padding: '20px 24px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
              <strong style={strongStyle}>Cosentus, LLC</strong><br />
              300 Spectrum Center Drive, Suite 1450<br />
              Irvine, CA 92618<br />
              <a href="mailto:sales@cosentus.com" style={{ color: 'var(--primary)' }}>sales@cosentus.com</a> | (949) 506-4185
            </div>

            <h3 style={h3Style}>18. Do You Need Extra Help?</h3>
            <p>If you would like this notice in another format (for example: audio, large print, braille) please contact us using the details above.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
