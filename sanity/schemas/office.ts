import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'office',
  title: 'Office Location',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'city', title: 'City', type: 'string' }),
    defineField({ name: 'state', title: 'State', type: 'string' }),
    defineField({ name: 'address', title: 'Full Address', type: 'text', rows: 2 }),
    defineField({ name: 'isHQ', title: 'Headquarters', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'city', isHQ: 'isHQ' },
    prepare({ title, subtitle, isHQ }) {
      return { title, subtitle: isHQ ? `${subtitle} (HQ)` : subtitle }
    },
  },
})
