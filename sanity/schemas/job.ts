import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'job',
  title: 'Job Listing',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Job Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'department', title: 'Department', type: 'string', options: { list: ['Operations', 'Technology', 'Sales', 'RCM', 'Billing', 'Coding', 'HR', 'Finance', 'Other'] } }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['Full-time', 'Part-time', 'Contract', 'Remote'] } }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'postedAt', title: 'Posted Date', type: 'date' }),
    defineField({ name: 'externalUrl', title: 'External Application URL', type: 'url' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'department', active: 'isActive' },
    prepare({ title, subtitle, active }) {
      return { title, subtitle: `${subtitle || ''} ${active ? '' : '(Inactive)'}`.trim() }
    },
  },
})
