import { client } from './client'

// Page hero content
export async function getPageData(slug: string) {
  return client.fetch(`*[_type == "page" && slug.current == $slug][0]{
    heroHeadline, heroSubtitle, seoTitle, seoDescription,
    "heroVideoUrl": heroVideo.asset->url,
    "heroImageUrl": heroImage.asset->url
  }`, { slug })
}

// Homepage
export async function getHomepageData() {
  return client.fetch(`{
    "page": *[_type == "page" && slug.current == "home"][0]{
      heroHeadline, heroSubtitle
    },
    "testimonials": *[_type == "testimonial" && featured == true] | order(_createdAt asc){
      _id, quote, author, authorTitle, company, specialty
    },
    "resultStats": *[_type == "resultStat"] | order(order asc){
      _id, value, label, sublabel
    },
    "advantages": *[_type == "advantage" && page == "homepage"] | order(order asc){
      _id, title, description, iconStyle, "iconUrl": icon.asset->url
    },
    "services": *[_type == "service" && location == "homepage"] | order(order asc){
      _id, title, description, link, statValue, statLabel, "iconUrl": icon.asset->url
    },
    "caseStudies": *[_type == "caseStudy"] | order(_createdAt asc){
      _id, title, specialty, headlineStat, summary, "slug": slug.current
    },
    "settings": *[_type == "siteSettings"][0]{
      phone, email, ctaText, ctaLink, footerTagline
    }
  }`)
}

// Site settings
export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    siteName, phone, email, address, ctaText, ctaLink,
    footerTagline, socialLinks,
    "logoUrl": logo.asset->url
  }`)
}

// Team members
export async function getTeamMembers(department?: string) {
  const filter = department
    ? `*[_type == "teamMember" && department == $department]`
    : `*[_type == "teamMember"]`
  return client.fetch(`${filter} | order(order asc){
    _id, name, role, bio, department, email, phone, linkedin,
    "photoUrl": photo.asset->url
  }`, { department })
}

// Blog posts
export async function getBlogPosts(limit = 20) {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...$limit]{
    _id, title, excerpt, category, publishedAt,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    "authorName": author->name
  }`, { limit })
}

export async function getBlogPost(slug: string) {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title, excerpt, category, publishedAt, body,
    "imageUrl": mainImage.asset->url,
    "authorName": author->name,
    "authorPhoto": author->photo.asset->url
  }`, { slug })
}

// News
export async function getNews(limit = 20) {
  return client.fetch(`*[_type == "news"] | order(date desc)[0...$limit]{
    _id, title, type, date, excerpt, externalUrl,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }`, { limit })
}

// Testimonials
export async function getTestimonials(specialty?: string) {
  const filter = specialty
    ? `*[_type == "testimonial" && specialty == $specialty]`
    : `*[_type == "testimonial"]`
  return client.fetch(`${filter}{
    _id, quote, author, authorTitle, company, specialty, featured,
    "photoUrl": photo.asset->url
  }`, { specialty })
}

// AI Agents
export async function getAgents() {
  return client.fetch(`*[_type == "agent"] | order(order asc){
    _id, name, role, description, category, highImpact,
    "photoUrl": photo.asset->url
  }`)
}

// Case studies
export async function getCaseStudies() {
  return client.fetch(`*[_type == "caseStudy"] | order(_createdAt asc){
    _id, title, specialty, headlineStat, summary, clientQuote, clientName,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }`)
}

// Partners
export async function getPartners() {
  return client.fetch(`*[_type == "partner"] | order(order asc){
    _id, name, url, "logoUrl": logo.asset->url
  }`)
}

// FAQs
export async function getFAQs(page: string) {
  return client.fetch(`*[_type == "faq" && page == $page] | order(order asc){
    _id, question, answer
  }`, { page })
}

// Jobs
export async function getJobs() {
  return client.fetch(`*[_type == "job" && isActive == true] | order(postedAt desc){
    _id, title, department, location, type, description, externalUrl, postedAt
  }`)
}

// Offices
export async function getOffices() {
  return client.fetch(`*[_type == "office"] | order(order asc){
    _id, name, city, state, address, isHQ
  }`)
}

// Specialty page services
export async function getSpecialtyServices(location: string) {
  return client.fetch(`*[_type == "service" && location == $location] | order(order asc){
    _id, title, description, "iconUrl": icon.asset->url
  }`, { location })
}
