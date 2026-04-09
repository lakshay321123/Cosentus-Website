import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: r => r.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'page', title: 'Page', type: 'string', options: { list: ['general', 'billing-coding', 'ehr-technology', 'practice-management', 'rcm', 'anesthesia', 'orthopedics', 'pain-management', 'asc', 'behavioral-health'] } }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'question', subtitle: 'page' } },
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
})
