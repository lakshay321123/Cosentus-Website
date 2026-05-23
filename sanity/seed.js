const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'q4h2tl8k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function seed() {
  console.log('Seeding Sanity...\n')

  // Site Settings
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Cosentus',
    phone: '(877) 806-2286',
    email: 'wecare@cosentus.com',
    address: '300 Spectrum Center Drive, Suite 1450, Irvine CA 92618',
    ctaText: 'Get Your Free Revenue Analysis',
    ctaLink: '/contact',
    footerTagline: 'Cut the noise. RCM that delivers.',
    socialLinks: { linkedin: 'https://www.linkedin.com/company/cosentus-llc/' },
  })
  console.log('✅ Site Settings')

  // Result Stats
  const stats = [
    { _id: 'stat-1', value: '98.5%', label: 'Coding Accuracy', order: 1 },
    { _id: 'stat-2', value: '98%', label: 'Net Collection Rate', order: 2 },
    { _id: 'stat-3', value: '38%', sublabel: 'Up to', label: 'Increased Revenue', order: 3 },
    { _id: 'stat-4', value: '>99%', label: 'Clean Claim Rate', order: 4 },
    { _id: 'stat-5', value: '<15%', label: 'AR > 120 Days', order: 5 },
    { _id: 'stat-6', value: '80%+', label: 'Patient Collection Rate', order: 6 },
  ]
  for (const s of stats) {
    await client.createOrReplace({ ...s, _type: 'resultStat' })
  }
  console.log('✅ Result Stats (6)')

  // Advantages - Homepage
  const advantages = [
    { _id: 'adv-1', title: 'Real + Artificial Intelligence', description: "Human specialty expertise combined with AI that's purpose-built for your revenue cycle. Cosentus.ai automates eligibility, claims, prior authorizations, scheduling, and patient billing.", iconStyle: 'teal', page: 'homepage', order: 1 },
    { _id: 'adv-2', title: 'Specialty Expertise', description: 'Teams organized by specialty — anesthesia, orthopedics, pain management, ASC, and behavioral health. They know every payer nuance and clinical detail.', iconStyle: 'bold', page: 'homepage', order: 2 },
    { _id: 'adv-3', title: 'True Partnership', description: "Independently owned. We manage your practice's financial health as if it were our own. Long-term decisions, not PE pressure.", iconStyle: 'reverse', page: 'homepage', order: 3 },
    { _id: 'adv-4', title: 'Outcome Focused', description: 'We measure success by the revenue gains we deliver — not vanity metrics. Up to 30% revenue growth and >98% net collection.', iconStyle: 'teal', page: 'homepage', order: 4 },
    { _id: 'adv-5', title: 'Tailored Solutions', description: 'No cookie-cutter packages. Every engagement is designed around your practice — your workflows, your payer mix, your growth goals.', iconStyle: 'teal', page: 'homepage', order: 5 },
    { _id: 'adv-6', title: 'Clarity Driven', description: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting, no guessing. Full visibility into every dollar.', iconStyle: 'teal', page: 'homepage', order: 6 },
  ]
  for (const a of advantages) {
    await client.createOrReplace({ ...a, _type: 'advantage' })
  }
  console.log('✅ Advantages (6)')

  // Homepage Testimonials
  const testimonials = [
    { _id: 'test-1', quote: "What separates Accreda from other anesthesia billing companies is its dedication to collecting every dollar possible for your business. Their year-over-year collection rate of 97% from commercial and non-commercial payors is staggering and has been vital for our group's survival.", author: 'Dr. John B. Field Jr.', authorTitle: 'Vice President', company: 'Anesthesia Associates', specialty: 'Anesthesia', featured: true },
    { _id: 'test-2', quote: 'I have used Cosentus billing for over 4 years. They bill right away, work in collection and help with coding. My reimbursements increased after they started coding for me.', author: 'Dr. Morteza Farr', authorTitle: 'Board Certified Orthopedic Surgeon', specialty: 'Orthopedics', featured: true },
    { _id: 'test-3', quote: "I've been in practice for nearly 20 years and Cosentus has provided nothing but positive experiences. Highly recommend without reservations.", author: 'Justin Lo, MD', authorTitle: 'President', company: 'Northern California Pain Specialists', specialty: 'Pain Management', featured: true },
    { _id: 'test-4', quote: 'Cosentus has truly been fantastic in all aspects. The job they have done on the outstanding balances saved our surgery center.', author: 'John Welsh, M.D.', specialty: 'ASC', featured: true },
    { _id: 'test-5', quote: "Cosentus ensures accurate, timely billing, reducing our Days in AR and improving cash flow. They're responsive to feedback and quick to implement RCM processes, automation, and reporting dashboards to streamline billing.", author: 'Sujan Vatturi', authorTitle: 'Chief Information Officer', company: 'Hope Services Counseling Center', specialty: 'Behavioral Health', featured: true },
  ]
  for (const t of testimonials) {
    await client.createOrReplace({ ...t, _type: 'testimonial' })
  }
  console.log('✅ Testimonials (5)')

  // AI Agents
  // Aligned with src/data/voice-agents.ts (canonical source).
  // 9 named personas. Updated May 2026.
  const agents = [
    { _id: 'agent-elly',   name: 'Elly',   role: 'Eligibility & Benefits Verification', description: 'Verifies eligibility and benefits before every appointment so coverage issues do not surface at the desk.', category: 'Pre-Service', order: 1 },
    { _id: 'agent-paige',  name: 'Paige',  role: 'Prior Authorization Follow-Up',       description: 'Tracks prior authorizations and closes them out before they delay procedures or drop into timely-filing territory.', category: 'Pre-Service', order: 2 },
    { _id: 'agent-priya',  name: 'Priya',  role: 'Pre-Service Payment Collection',      description: 'Reaches patients three to seven days pre-procedure with verified estimates so collection rates stay 30-40% higher than post-service.', category: 'Pre-Service', order: 3 },
    { _id: 'agent-april',  name: 'April',  role: 'Medical Scheduling',                  description: 'Runs inbound and outbound scheduling, confirmations, and reminders to cut no-shows and fill the calendar.', category: 'Pre-Service', order: 4 },
    { _id: 'agent-curtis', name: 'Curtis', role: 'Customer Service & Overflow',         description: 'Covers after-hours and overflow so no patient call goes unanswered.', category: 'Post-Service', order: 5 },
    { _id: 'agent-chris',  name: 'Chris',  role: 'Claim Follow-Up',                     description: 'Specializes in billing workflows and claim follow-up with payers to resolve pending claims and processing delays.', category: 'Post-Service', order: 6 },
    { _id: 'agent-cindy',  name: 'Cindy',  role: 'Patient Payment & Collections',       description: 'Multilingual patient balance collection (50+ languages), offers payment plans, and processes payments in real time.', category: 'Post-Service', highImpact: true, order: 7 },
    { _id: 'agent-ariel',  name: 'Ariel',  role: 'AR Follow-Up',                        description: 'Works AR aging, payer follow-up, and underpayment recovery so cash keeps moving.', category: 'Post-Service', order: 8 },
    { _id: 'agent-connie', name: 'Connie', role: 'Medical Coding',                      description: 'Assists with medical coding accuracy, modifier selection, and clinical documentation improvement.', category: 'Post-Service', order: 9 },
  ]
  for (const a of agents) {
    await client.createOrReplace({ ...a, _type: 'agent' })
  }
  console.log('✅ AI Agents (9)')

  // Case Studies
  const cases = [
    { _id: 'case-anesthesia', title: 'Anesthesia: Sub-48-Hour Turnaround', specialty: 'Anesthesia', headlineStat: '<48hr', summary: 'A 50+ site anesthesia group eliminated revenue leakage, achieved sub-48-hour turnaround, and drove significant cash flow improvement through contract optimization and dedicated AR follow-up.' },
    { _id: 'case-behavioral', title: 'Behavioral Health: $2M to $16M Revenue Growth', specialty: 'Behavioral Health', headlineStat: '700%', summary: 'Hope Services grew revenue from $2M to $16M serving 3,500+ individuals with developmental disabilities — powered by automated Medi-Cal billing, custom compliance logic, and real-time Power BI reporting.' },
    { _id: 'case-ortho', title: 'Orthopedic: 46% Revenue Growth', specialty: 'Orthopedics', headlineStat: '46%', summary: 'A multi-physician orthopedic practice grew revenue 46% — from $1.5M to $2.2M — while cutting Workers\' Comp turnaround from 45 to 28 days.' },
    { _id: 'case-dme', title: 'DME: Sales Doubled $82M to $165M', specialty: 'DME', headlineStat: '2x', summary: 'A high-volume DME provider doubled sales from $82M to $165M, reduced DSO by 56%, and cut denial rates 31% through rapid billing stabilization and AI automation.' },
  ]
  for (const c of cases) {
    await client.createOrReplace({ ...c, _type: 'caseStudy' })
  }
  console.log('✅ Case Studies (4)')

  // Office Locations
  const offices = [
    { _id: 'office-irvine', name: 'Headquarters', city: 'Irvine', state: 'CA', address: '300 Spectrum Center Drive, Suite 1450, Irvine CA 92618', isHQ: true, order: 1 },
    { _id: 'office-phoenix', name: 'Phoenix', city: 'Phoenix', state: 'AZ', order: 2 },
    { _id: 'office-mission', name: 'Mission', city: 'Mission', state: 'TX', order: 3 },
    { _id: 'office-napa', name: 'Napa', city: 'Napa', state: 'CA', order: 4 },
    { _id: 'office-dallas', name: 'Dallas', city: 'Dallas', state: 'TX', order: 5 },
    { _id: 'office-olathe', name: 'Olathe', city: 'Olathe', state: 'KS', order: 6 },
  ]
  for (const o of offices) {
    await client.createOrReplace({ ...o, _type: 'office' })
  }
  console.log('✅ Offices (6)')

  // Pages (hero content)
  const pages = [
    { _id: 'page-home', title: 'Homepage', slug: { _type: 'slug', current: 'home' }, heroHeadline: 'Think Growth.', heroSubtitle: '25 years of specialty RCM expertise, amplified by Real + Artificial Intelligence.' },
    { _id: 'page-about', title: 'About Us', slug: { _type: 'slug', current: 'about' }, heroHeadline: 'About Cosentus', heroSubtitle: 'For more than 25 years, we have helped physician practices, specialty groups, and surgery centers grow revenue, eliminate billing inefficiencies, and scale operations.' },
    { _id: 'page-ra', title: 'R+A Intelligence', slug: { _type: 'slug', current: 'cosentus-ai' }, heroHeadline: 'Real + Artificial Intelligence', heroSubtitle: '8 agents. Zero excuses. Infinite follow-ups.' },
    { _id: 'page-anesthesia', title: 'Anesthesia (Accreda)', slug: { _type: 'slug', current: 'anesthesia' }, heroHeadline: 'Beyond Billing. Built for Anesthesia.', heroSubtitle: 'Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience.' },
    { _id: 'page-orthopedics', title: 'Orthopedics', slug: { _type: 'slug', current: 'orthopedics' }, heroHeadline: 'Think Growth. Your Dedicated Orthopedic Revenue Cycle Partner.', heroSubtitle: 'Joint replacements, arthroscopy, spinal surgery, and implant cases demand surgical-grade coding and proactive contract management.' },
    { _id: 'page-pain', title: 'Pain Management', slug: { _type: 'slug', current: 'pain-management' }, heroHeadline: 'Pain Management Revenue Gets Lost Between Clinical Complexity and Payer Scrutiny.', heroSubtitle: 'We Close That Gap.' },
    { _id: 'page-asc', title: 'ASC', slug: { _type: 'slug', current: 'asc' }, heroHeadline: 'Your ASC Runs Dozens of Cases a Day.', heroSubtitle: 'Your Billing Needs to Keep Up With Every One.' },
    { _id: 'page-bh', title: 'Behavioral Health', slug: { _type: 'slug', current: 'behavioral-health' }, heroHeadline: 'Behavioral Health Demand Is Surging.', heroSubtitle: 'The Billing Complexity Is Surging With It.' },
    { _id: 'page-billing', title: 'Medical Billing & Coding', slug: { _type: 'slug', current: 'billing-coding' }, heroHeadline: 'Expert-Led Medical Billing Across 20+ Specialties.', heroSubtitle: 'Powered by Real + Artificial Intelligence.' },
    { _id: 'page-pm', title: 'Complete Practice Management', slug: { _type: 'slug', current: 'practice-management' }, heroHeadline: 'Run a More Profitable Practice Without Adding to Your Workload.', heroSubtitle: 'We manage the operational complexity of running a medical practice.' },
    { _id: 'page-ehr', title: 'EHR & Technology', slug: { _type: 'slug', current: 'ehr-technology' }, heroHeadline: 'EHR Agnostic. Seamlessly Integrated.', heroSubtitle: 'Works with your existing EHR. No migrations. No disruption.' },
    { _id: 'page-rcm', title: 'Comprehensive RCM', slug: { _type: 'slug', current: 'rcm' }, heroHeadline: 'End-to-End Revenue Cycle Management.', heroSubtitle: 'Every Step. Every Dollar.' },
    { _id: 'page-contact', title: 'Contact Us', slug: { _type: 'slug', current: 'contact' }, heroHeadline: "Let's Talk About Your Revenue", heroSubtitle: "We'll give you a clear assessment of what's possible. No pressure." },
    { _id: 'page-careers', title: 'Careers', slug: { _type: 'slug', current: 'careers' }, heroHeadline: 'Build a Career That Changes Healthcare.', heroSubtitle: 'Independently owned. Great Place to Work certified three years running.' },
  ]
  for (const p of pages) {
    await client.createOrReplace({ ...p, _type: 'page' })
  }
  console.log('✅ Pages (14)')

  // Services - Homepage
  const services = [
    { _id: 'svc-billing', title: 'Medical Billing & Coding', description: 'Specialty-trained coders and billers. End-to-end claim submission, denial management, appeals, and follow-up — 98.5% coding accuracy and >99% clean claim rates.', link: '/services/billing-coding', location: 'homepage', order: 1 },
    { _id: 'svc-pm', title: 'Complete Practice Management', description: 'Front desk operations, credentialing, scheduling, financial counseling, and operational support — so your team can focus on patients.', link: '/services/practice-management', location: 'homepage', order: 2 },
    { _id: 'svc-ehr', title: 'EHR & Technology', description: 'EHR agnostic — seamlessly integrated with your existing systems. Or upgrade to Medcloud for real-time analytics and AI-powered workflows.', link: '/services/ehr-technology', location: 'homepage', order: 3 },
    { _id: 'svc-rcm', title: 'Comprehensive RCM', description: 'The full revenue cycle managed end-to-end: eligibility, coding, submission, denials, payments, patient collections, and reporting.', link: '/healthcare-revenue-cycle-management', location: 'homepage', order: 4 },
  ]
  for (const s of services) {
    await client.createOrReplace({ ...s, _type: 'service' })
  }
  console.log('✅ Services (4)')

  console.log('\n🎉 Seeding complete! All content is now in Sanity.')
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1) })
