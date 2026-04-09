import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'author', title: 'Author Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'authorTitle', title: 'Author Title / Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company / Practice', type: 'string' }),
    defineField({ name: 'specialty', title: 'Specialty', type: 'string', options: { list: ['Anesthesia', 'Orthopedics', 'Pain Management', 'ASC', 'Behavioral Health', 'Urgent Care', 'General'] } }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'photo', title: 'Author Photo', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'specialty', media: 'photo' },
  },
})
