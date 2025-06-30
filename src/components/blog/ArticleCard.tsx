import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Clock, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: string
    publishedAt?: Date
    createdAt: Date
    author: {
      name?: string
    }
    categories: {
      category: {
        name: string
        slug: string
        color?: string
      }
    }[]
    _count?: {
      comments: number
    }
  }
  priority?: boolean
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const publishDate = article.publishedAt || article.createdAt
  const timeAgo = formatDistanceToNow(publishDate, { 
    addSuffix: true, 
    locale: de 
  })

  const readingTime = Math.ceil((article.excerpt?.length || 0) / 200) // Rough estimate

  return (
    <article className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Categories Badge */}
          {article.categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <Link
                href={`/kategorien/${article.categories[0].category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white transition-colors duration-200"
              >
                <Tag className="h-3 w-3 mr-1" />
                {article.categories[0].category.name}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Categories (if no featured image) */}
        {!article.featuredImage && article.categories.length > 0 && (
          <div className="mb-3">
            <Link
              href={`/kategorien/${article.categories[0].category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200"
            >
              <Tag className="h-3 w-3 mr-1" />
              {article.categories[0].category.name}
            </Link>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
          <Link href={`/blog/${article.slug}`} className="stretched-link">
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{article.author.name || 'GreenMindShift'}</span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time dateTime={publishDate.toISOString()}>
                {timeAgo}
              </time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{readingTime} Min. Lesezeit</span>
            </div>
          </div>

          {/* Comments Count */}
          {article._count?.comments && article._count.comments > 0 && (
            <div className="text-green-600 font-medium">
              {article._count.comments} Kommentar{article._count.comments !== 1 ? 'e' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300 pointer-events-none" />
    </article>
  )
} 