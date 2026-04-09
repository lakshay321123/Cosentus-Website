import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'resultStat',
  title: 'Result Stat',
  type: 'document',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: r => r.required(), description: 'e.g. "98.5%"' }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required(), description: 'e.g. "Coding Accuracy"' }),
    defineField({ name: 'sublabel', title: 'Sublabel', type: 'string', description: 'e.g. "Up to" shown above the value' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
})
