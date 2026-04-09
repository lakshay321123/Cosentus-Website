import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: "Let's Talk About Your Revenue | Contact Cosentus",
  description: "Evaluating billing partners? Frustrated with collections? We'll give you a clear assessment of what's possible.",
}

export default function ContactPage() {
  return (
    <main>
      <PageHero
        label="CONTACT US"
        title="Let's Talk About Your Revenue"
        subtitle="Evaluating billing partners? Frustrated with collections? We'll give you a clear assessment of what's possible. No pressure."
      />
      <ContactContent />
    </main>
  )
}
