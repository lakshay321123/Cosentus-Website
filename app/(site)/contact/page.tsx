import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { getPageData } from '@/sanity/lib/queries'
import ContactContent from './ContactContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: "Let's Talk About Your Revenue | Contact Cosentus",
  description: "Evaluating billing partners? Frustrated with collections? We'll give you a clear assessment of what's possible.",
}

export default async function ContactPage() {
  
  let page: any = null
  try { page = await getPageData('contact') } catch (e) {}

  return (
    <main>
      <PageHero
        label="CONTACT US"
        title={page?.heroHeadline || "Let's Talk About Your Revenue"}
        subtitle={page?.heroSubtitle || "Evaluating billing partners? Frustrated with collections? We'll give you a clear assessment of what's possible. No pressure."}
      />
      <ContactContent />
    </main>
  )
}
