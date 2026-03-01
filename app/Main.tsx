'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const POSTS_PER_PAGE = 40
const LOAD_MORE = 20

const CATEGORIES = [
  'All',
  'Tech & AI',
  'Crypto & Bitcoin',
  'E-Commerce',
  'Invest',
  'Child Development',
  'Food & Health',
  'Travel',
  'Auto',
  'Fact Check',
]

export default function Home({ posts }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((post) => post.tags?.some((tag) => tag === activeCategory))

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!hasMore) return
    const scrollY = window.scrollY
    const windowH = window.innerHeight
    const docH = document.documentElement.scrollHeight
    if (scrollY + windowH >= docH - 400) {
      setVisibleCount((prev) => prev + LOAD_MORE)
    }
  }, [hasMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE)
  }, [activeCategory])

  return (
    <>
      {/* Category Filter Bar */}
      <div className="mb-8 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 pb-2">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? posts.length
                : posts.filter((p) => p.tags?.includes(cat)).length
            if (count === 0 && cat !== 'All') return null
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Post Count */}
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' && ` in ${activeCategory}`}
      </p>

      {/* Posts Grid — Wired-inspired */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => {
          const { slug, date, title, summary, tags, images } = post
          const heroImage = images?.[0] || null

          return (
            <article
              key={slug}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              {/* Image */}
              {heroImage && (
                <Link href={`/blog/${slug}`} className="block overflow-hidden">
                  <img
                    src={heroImage}
                    alt={title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Tags */}
                <div className="mb-2 flex flex-wrap gap-1">
                  {tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="mb-2 text-lg font-bold leading-snug tracking-tight">
                  <Link
                    href={`/blog/${slug}`}
                    className="text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    {title}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
                  {summary}
                </p>

                {/* Date */}
                <time
                  dateTime={date}
                  className="text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500"
                >
                  {formatDate(date, siteMetadata.locale)}
                </time>
              </div>
            </article>
          )
        })}
      </div>

      {/* Loading indicator */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100" />
        </div>
      )}

      {!hasMore && filteredPosts.length > POSTS_PER_PAGE && (
        <p className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500">
          All {filteredPosts.length} articles loaded
        </p>
      )}

      {filteredPosts.length === 0 && (
        <p className="py-20 text-center text-gray-400">No articles in this category yet.</p>
      )}
    </>
  )
}
