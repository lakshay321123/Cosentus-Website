import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Hero Subtitle', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroVideo', title: 'Hero Video', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'sections', title: 'Page Sections', type: 'array', of: [
      {
        type: 'object',
        name: 'section',
        title: 'Section',
        fields: [
          defineField({ name: 'label', title: 'Section Label', type: 'string' }),
          defineField({ name: 'heading', title: 'Heading', type: 'string' }),
          defineField({ name: 'body', title: 'Body', type: 'array', of: [
            { type: 'block' },
            { type: 'image', options: { hotspot: true } },
          ]}),
          defineField({ name: 'image', title: 'Section Image', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
          defineField({ name: 'ctaLink', title: 'CTA Button Link', type: 'string' }),
        ],
        preview: {
          select: { title: 'heading', subtitle: 'label' },
        },
      },
    ]}),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
