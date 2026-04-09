import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'specialty', title: 'Specialty', type: 'string', options: { list: ['Anesthesia', 'Orthopedics', 'Pain Management', 'ASC', 'Behavioral Health', 'Urgent Care', 'DME'] } }),
    defineField({ name: 'headlineStat', title: 'Headline Stat', type: 'string', description: 'e.g. "46% Revenue Growth"' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
    defineField({ name: 'challenge', title: 'Challenge', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'solution', title: 'Solution', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'results', title: 'Results', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'clientQuote', title: 'Client Quote', type: 'text' }),
    defineField({ name: 'clientName', title: 'Client Name', type: 'string' }),
    defineField({ name: 'mainImage', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'specialty', media: 'mainImage' },
  },
})
