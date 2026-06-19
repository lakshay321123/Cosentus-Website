/**
 * Shared voice agents data.
 *
 * Canonical list of the 9 Cosentus voice agents — used by:
 *   - src/components/sections/RASection.tsx (homepage R+A grid)
 *   - app/(site)/cosentus-ai/RAPageContent.tsx (Technology page grid)
 *
 * AGENTID MAPPING (per Lakshay, May 2026):
 * The Cosentus.ai marketing site has 8 trained Retell agents (Allison,
 * Chris, Cindy, Emily, Harper, Michael, Olivia, Sarah). The main website
 * has 9 named personas. Each homepage agent is mapped to the closest-
 * matching reference Retell agentId so all 9 cards make functional voice
 * calls. Voice persona / greeting heard on the call is the underlying
 * Retell agent's, NOT necessarily the displayed name — that's the known
 * gap until dedicated Retell agents are provisioned for each homepage
 * persona. Lakshay accepted this trade-off so all 9 cards are functional.
 *
 * Mapping rationale:
 *   Elly   (Eligibility)   → Harper  (Credentialing — pre-service domain)
 *   Paige  (Authorization) → Olivia  (closest unused agent)
 *   Priya  (Pre-Pay)       → Priya   (dedicated Retell agent, no longer reusing Cindy)
 *   April  (Scheduling)    → Allison (Intake — exact role match)
 *   Curtis (Support)       → Michael (Operations)
 *   Chris  (Claims)        → Chris   (EXACT name match)
 *   Cindy  (Patient)       → Cindy   (EXACT name match)
 *   Ariel  (AR)            → Sarah   (closest unused — reporting/data)
 *   Connie (Coding)        → Emily   (Coding — EXACT role match)
 */

export interface VoiceAgentData {
  name: string         // Displayed name, homepage canonical
  shortRole: string    // Sub-text under name on grids (homepage style)
  role: string         // Single-word role used in modal eyebrow ("INTAKE AGENT")
  img: string          // Filename in /public/images/
  agentId: string | null  // Retell agent_xxx id, null = no real call (demo)
  greeting: string     // Initial transcript shown before SDK updates fire
  popupImage?: string  // Optional filename in /public/images/ — when set, the
                       // call modal renders this PNG (with drop-shadow glow)
                       // INSTEAD of the circular .call-avatar. Used for the
                       // richer "scene" treatment Lakshay approved as a sample
                       // (May 2026 starting with April). Other agents keep the
                       // circular avatar until they get their own scene PNG.
}

// Reference Retell agentIds (from /tmp/cosentus-ai-ref/agents.jsx):
// const REF = {
//   ALLISON: 'agent_9d9f880dbde25925f75e5b2739',
//   CHRIS:   'agent_9571fe9261e3944f33777a1406',
//   CINDY:   'agent_4510e7416ee31ca808b8546ed7',
//   EMILY:   'agent_ff8707dccf16f96ecec4c448d3',
//   HARPER:  'agent_f7e96fe43ce9bb611481839af8',
//   MICHAEL: 'agent_443ead51c8a35f874d0ca1a8c1',
//   OLIVIA:  'agent_a8f606995d3160a92be6874661',
//   SARAH:   'agent_1b7fe9e057f84254f4fcca9256',
// }

export const AGENTS: VoiceAgentData[] = [
  {
    name: 'Elly', shortRole: 'Eligibility', role: 'Eligibility',
    img: 'elly.png',
    popupImage: 'elly-popup.png',
    agentId: 'agent_f7e96fe43ce9bb611481839af8',  // Harper (closest pre-service)
    greeting: "Hi, I'm Elly, I verify eligibility and benefits before every appointment so coverage issues don't surface at the desk.",
  },
  {
    name: 'Paige', shortRole: 'Authorization', role: 'Authorization',
    img: 'paige.png',
    popupImage: 'paige-popup.png',
    agentId: 'agent_a8f606995d3160a92be6874661',  // Olivia (closest unused)
    greeting: "Hey, I'm Paige, I track prior authorizations and close them out before they delay procedures or drop into timely-filing territory.",
  },
  {
    name: 'Priya', shortRole: 'Payments', role: 'Payments',
    img: 'priya.png',
    popupImage: 'priya-popup.png',
    agentId: 'agent_2bee7d69491f54281cf556b3e1',  // Priya (dedicated agent, no longer reusing Cindy)
    greeting: "Hi, I'm Priya, I reach patients three to seven days pre-procedure with verified estimates so collection rates stay 30-40% higher.",
  },
  {
    name: 'April', shortRole: 'Scheduling', role: 'Scheduling',
    img: 'april.png',
    popupImage: 'april-popup.png',
    agentId: 'agent_9d9f880dbde25925f75e5b2739',  // Allison (Intake, scheduling)
    greeting: "Hi, I'm April, I run inbound and outbound scheduling, confirmations, and reminders to cut no-shows and fill the calendar.",
  },
  {
    name: 'Curtis', shortRole: 'Support', role: 'Support',
    img: 'curtis.png',
    popupImage: 'curtis-popup.png',
    agentId: 'agent_443ead51c8a35f874d0ca1a8c1',  // Michael (Operations)
    greeting: "Hey, Curtis here, I cover after-hours and overflow so no patient call goes unanswered. What's on your mind?",
  },
  {
    name: 'Chris', shortRole: 'Claims', role: 'Claims',
    img: 'chris.png',
    popupImage: 'chris-popup.png',
    agentId: 'agent_9571fe9261e3944f33777a1406',  // Chris (EXACT match)
    greeting: "Hey, Chris here, I specialize in billing workflows and claim follow-up. What do you need?",
  },
  {
    name: 'Cindy', shortRole: 'Collections', role: 'Collections',
    img: 'cindy.png',
    popupImage: 'cindy-popup.png',
    agentId: 'agent_4510e7416ee31ca808b8546ed7',  // Cindy (EXACT match)
    greeting: "Hi, I'm Cindy, I focus on patient balance collections and AR follow-up in 50+ languages. Want to talk strategy?",
  },
  {
    name: 'Ariel', shortRole: 'AR', role: 'AR',
    img: 'ariel.png',
    popupImage: 'ariel-popup.png',
    agentId: 'agent_1b7fe9e057f84254f4fcca9256',  // Sarah (closest unused)
    greeting: "Hi, I'm Ariel, I work AR aging, payer follow-up, and underpayment recovery so cash keeps moving.",
  },
  {
    name: 'Connie', shortRole: 'Coding', role: 'Coding',
    img: 'connie.png',
    popupImage: 'connie-popup.png',
    agentId: 'agent_ff8707dccf16f96ecec4c448d3',  // Emily (Coding, EXACT role)
    greeting: "Hi, I'm Connie, I assist with medical coding accuracy, modifier selection, and CDI. How can I help?",
  },
]
