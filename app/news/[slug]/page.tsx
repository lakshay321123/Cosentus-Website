import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { newsArticles } from '@/data/newsArticles'
import NewsArticleContent from './NewsArticleContent'

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = newsArticles.find((a) => a.slug === params.slug)
  if (!article) return { title: 'News | Cosentus' }
  return {
    title: `${article.title} | Cosentus News`,
    description: article.body.slice(0, 160).replace(/[#*]/g, ''),
  }
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = newsArticles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  return <NewsArticleContent article={article} />
}
