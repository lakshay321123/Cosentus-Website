import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'advantage',
  title: 'Advantage',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icon', type: 'image' }),
    defineField({ name: 'iconStyle', title: 'Icon Style', type: 'string', options: { list: ['teal', 'bold', 'reverse'] }, initialValue: 'teal' }),
    defineField({ name: 'page', title: 'Page', type: 'string', options: { list: ['homepage', 'anesthesia', 'orthopedics', 'pain-management', 'asc', 'behavioral-health'] }, initialValue: 'homepage' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'page', media: 'icon' } },
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
})
