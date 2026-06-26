import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogBySlug, getAllBlogSlugs } from '@/data/blogPosts'
import BlogPostContent from './BlogPostContent'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogBySlug(params.slug)
  if (!post) return { title: 'Blog Post Not Found' }
  return {
    title: `${post.title} | Cosentus Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogBySlug(params.slug)
  if (!post) notFound()

  return (
    <main>
      <BlogPostContent post={post} />
    </main>
  )
}
