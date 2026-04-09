import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icon', type: 'image' }),
    defineField({ name: 'link', title: 'Link', type: 'string' }),
    defineField({ name: 'statValue', title: 'Stat Value', type: 'string', description: 'e.g. "98.5%"' }),
    defineField({ name: 'statLabel', title: 'Stat Label', type: 'string', description: 'e.g. "Coding Accuracy"' }),
    defineField({ name: 'location', title: 'Where Used', type: 'string', options: { list: ['homepage', 'billing-coding', 'practice-management', 'ehr-technology', 'rcm', 'anesthesia', 'orthopedics', 'pain-management', 'asc', 'behavioral-health'] } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'location', media: 'icon' } },
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
})
