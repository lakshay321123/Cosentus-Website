import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'Cosentus' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
    defineField({ name: 'ctaText', title: 'Primary CTA Text', type: 'string', initialValue: 'Get Your Free Revenue Analysis' }),
    defineField({ name: 'ctaLink', title: 'Primary CTA Link', type: 'string', initialValue: '/contact' }),
    defineField({ name: 'footerTagline', title: 'Footer Tagline', type: 'string' }),
    defineField({ name: 'socialLinks', title: 'Social Links', type: 'object', fields: [
      defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
      defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
      defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
    ]}),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
