import { Metadata } from 'next'
import BehavioralHealthContent from './BehavioralHealthContent'

export const metadata: Metadata = {
  title: 'Behavioral Health Billing & RCM | Psychiatry, Therapy, IOP/PHP & Telehealth | Cosentus',
  description: 'Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules.',
}

export default function BehavioralHealthPage() {
  return <BehavioralHealthContent />
}
