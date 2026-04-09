import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'news',
  title: 'News & Events',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['News', 'Event', 'Press Release', 'Award'] } }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [
      { type: 'block' },
      { type: 'image', options: { hotspot: true } },
    ]}),
    defineField({ name: 'mainImage', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'externalUrl', title: 'External Link', type: 'url', description: 'If this links to an external article' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type', date: 'date', media: 'mainImage' },
    prepare({ title, subtitle, date, media }) {
      return { title, media, subtitle: `${subtitle || ''} ${date ? '— ' + date : ''}`.trim() }
    },
  },
  orderings: [{ title: 'Date', name: 'date', by: [{ field: 'date', direction: 'desc' }] }],
})
