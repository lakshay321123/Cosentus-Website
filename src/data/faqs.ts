/**
 * Canonical FAQ data — used by the homepage FAQSection (first 3 only)
 * and by /faqs (all 10). Plain TypeScript so it ships with the bundle
 * at build time; no Sanity / CMS round-trip required for SSR.
 *
 * Content sourced from the Cosentus messaging doc (March 2026) plus
 * the canonical positioning on R+A. Every claim here can be traced
 * back to that doc — if you change something, double-check the doc
 * doesn't say otherwise on a different page.
 *
 * Answer length is intentionally bounded to 60–130 words. That range
 * is the sweet spot for FAQPage rich-results eligibility on Google
 * and for citation by LLM-powered search (Perplexity, Google AI
 * Overviews, ChatGPT search). Long enough to be substantive, short
 * enough to be picked up as a single snippet.
 */

export type FAQ = {
  /** Stable slug — used for anchor links, schema @id, and React keys.
   *  Never reuse a slug; once published, search engines may cite it. */
  slug: string
  /** Short uppercase eyebrow shown above the question (e.g. POSITIONING). */
  category: string
  /** The question, as a real person would phrase it. */
  question: string
  /** The answer. Plain prose; first sentence carries the headline
   *  claim (this is what LLM citations tend to extract). */
  answer: string
  /** Set true to surface this FAQ in the homepage 3-card section.
   *  Exactly 3 entries should have this. */
  homepage?: boolean
}

export const faqs: FAQ[] = [
  {
    slug: 'what-is-real-artificial-intelligence',
    category: 'Positioning',
    question: 'How is Real + Artificial Intelligence different from regular AI billing tools?',
    answer:
      'Real + Artificial Intelligence pairs 25 years of specialty RCM expertise with nine AI voice agents purpose-built for healthcare revenue cycle. The AI handles volume — eligibility verification, prior-auth follow-ups, claim status checks, patient collections — while named human teams own coding judgement, denials strategy, and payer negotiation. Most AI billing tools try to replace humans and miss specialty nuance; most legacy RCM firms add headcount and miss scale. R+A does both, which is why most clients see up to 30% revenue growth within 12 months.',
    homepage: true,
  },
  {
    slug: 'do-i-have-to-switch-ehr',
    category: 'Integration',
    question: 'Do I have to switch my EHR to work with Cosentus?',
    answer:
      'No. Cosentus is EHR-agnostic and integrates directly with Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, ClarityStack, HALOMD and most other major systems. Your clinical workflow stays exactly where it is — we connect to the EHR you already use, pull charges, push claims, and surface analytics back into your dashboard. If you want a purpose-built option, Medcloud (our cloud PM platform) is available, but it is never required to work with us.',
    homepage: true,
  },
  {
    slug: 'how-quickly-will-i-see-results',
    category: 'Results',
    question: 'How quickly will I see results?',
    answer:
      'Most clients see measurable improvement within 3–6 months and up to 30% revenue growth within 12 months. Clean-claim rate and denial-recovery improvements typically show in the first 60 days because those workflows are where our AI agents and specialty-trained coders make the largest immediate impact. The exact pace depends on your payer mix, the state of your existing AR, and how clean your charge capture is at intake. Every account gets a named client success manager who reports against these benchmarks weekly.',
    homepage: true,
  },
  {
    slug: 'is-my-patient-data-secure',
    category: 'Security',
    question: 'Is my patient data secure?',
    answer:
      'Yes. Cosentus is SOC 2 audited and HIPAA compliant, with PHI encrypted in transit and at rest, role-based access enforced for every team member, and a documented breach-response programme. All data handling is independently audited annually, and Business Associate Agreements are signed before any PHI changes hands. The security programme covers our offshore operations centres on the same standard as our US sites — no weak link by geography.',
  },
  {
    slug: 'which-specialties-do-you-support',
    category: 'Coverage',
    question: 'Which specialties do you support?',
    answer:
      'Our deepest specialty practices are Anesthesia (via our Accreda division), Orthopedics, Pain Management, Ambulatory Surgery Centers, and Behavioral Health. We also serve Urgent Care, OBGYN, Ophthalmology, Endoscopy, General Surgery, ENT, Dermatology, and more — 20+ specialties in total. Each specialty has its own team that knows the payer nuances, modifier rules, and documentation requirements specific to that case mix. You will not get a generalist queue.',
  },
  {
    slug: 'how-does-pricing-work',
    category: 'Pricing',
    question: 'How does pricing work?',
    answer:
      'Pricing is a percentage of net collections — you pay only on dollars actually collected, not on claims submitted. There are no setup fees, no per-claim charges, and no surprise add-ons. The exact percentage depends on your specialty, monthly volume, and the scope of services (billing-only vs full comprehensive RCM vs full practice management). We quote the rate during the Free Revenue Analysis so the number is grounded in your real numbers, not a list price.',
  },
  {
    slug: 'what-does-onboarding-look-like',
    category: 'Onboarding',
    question: 'What does onboarding look like?',
    answer:
      'Four stages, typically 30–45 days end-to-end. (1) Discovery: deep-dive into your payer mix, denial patterns, and current AR. (2) System integration: we connect to your EHR and clearinghouse, no data migration required. (3) Parallel run: we shadow your existing workflow so claims keep flowing while we learn your practice. (4) Go-live: your named client success manager takes ownership, with weekly check-ins, a monthly operational review, and a quarterly business review.',
  },
  {
    slug: 'how-do-you-handle-denials',
    category: 'Operations',
    question: 'How do you handle denials?',
    answer:
      'Every denial is categorised by root cause, appealed with clinical rationale by specialty-trained denials experts, and tracked in your real-time dashboard with the appeal stage visible. Our appeal success rate is over 95%. Just as importantly, denial patterns are fed back into the workflow — if a payer denies a CPT-modifier combination repeatedly, that pattern is corrected upstream so the same denial does not recur. Prevention is faster than recovery, and that is where the long-term revenue gains come from.',
  },
  {
    slug: 'what-if-im-not-happy',
    category: 'Risk',
    question: 'What if I am not happy with the service?',
    answer:
      'No long-term lock-in. Contracts run 12 months with a 60-day exit clause; your data, credentialing files, and payer enrolments remain yours throughout. We do not hold a practice hostage to keep the account. That said, customer retention sits at 99% — once practices see the dashboard transparency, the named team, and the cash improvement, they tend to stay. The exit clause exists for risk mitigation, not because we expect anyone to use it.',
  },
  {
    slug: 'how-is-cosentus-different',
    category: 'Differentiation',
    question: 'How is Cosentus different from a typical RCM company?',
    answer:
      'Three things. One: we are privately and independently owned — no private equity pressure to chase quarterly margin at the expense of your collections. Two: teams are organised by specialty, so the people working your account know every payer nuance and clinical detail of your case mix. Three: the Real + Artificial Intelligence model means AI scales the high-volume work while a named human team retains accountability for judgement calls — coding, denials, payer negotiation. You get the same lead every week, not a rotating queue.',
  },
]

/** Helper: homepage-facing FAQs in display order. */
export const homepageFaqs = faqs.filter(f => f.homepage)
