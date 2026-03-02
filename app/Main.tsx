'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from '@/components/Link'
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

function AdBanner({ slot = '1234567890', className = '' }) {
  return (
    <div className={`flex items-center justify-center bg-gray-50 py-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8178097336205658"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default function Home({ posts }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  const filteredPosts =
    activeCategory === 'All'
      ? posts
      : posts.filter((post) => post.tags?.some((tag) => tag === activeCategory))

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  const handleScroll = useCallback(() => {
    if (!hasMore) return
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 400) {
      setVisibleCount((prev) => prev + LOAD_MORE)
    }
  }, [hasMore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE)
  }, [activeCategory])

  return (
    <>
      {/* Category Filter */}
      <div className="mb-12 border-b border-gray-100">
        <div className="flex gap-6 pb-3 overflow-x-auto">
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
                className={`whitespace-nowrap pb-2 font-mono text-[12px] font-medium tracking-tight transition-colors ${
                  activeCategory === cat
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="columns-1 gap-10 sm:columns-2 lg:columns-3 xl:columns-4">
        {visiblePosts.map((post, index) => {
          const { slug, date, title, summary, tags, images } = post
          const heroImage = images?.[0] || null
          const primaryTag = tags?.[0] || 'Research'

          return (
            <div key={slug}>
              {index > 0 && index % 5 === 0 && (
                <div className="mb-12 break-inside-avoid">
                  <AdBanner slot={`grid-${index}`} />
                </div>
              )}
              <article className="mb-12 break-inside-avoid">
                {heroImage && (
                  <Link href={`/blog/${slug}`} className="mb-4 block">
                    <img src={heroImage} alt={title} className="w-full object-cover" loading="lazy" />
                  </Link>
                )}
                <p className="mb-2">
                  <span className="inline-block border border-[#A3A5F1] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-[#5E61DE]">
                    {primaryTag}
                  </span>
                </p>
                <h2 className="mb-2 text-[18px] font-semibold leading-snug tracking-tight text-gray-900 lg:text-[20px]">
                  <Link href={`/blog/${slug}`} className="hover:text-gray-600 transition-colors">
                    {title}
                  </Link>
                </h2>
                <p className="mb-3 text-[14px] leading-relaxed text-gray-500">
                  {summary?.slice(0, 140)}
                  {summary && summary.length > 140 ? '\u2026' : ''}
                </p>
                <p className="font-mono text-[10px] font-medium text-gray-300">
                  {formatDate(date, siteMetadata.locale)}
                </p>
              </article>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-gray-200 border-t-gray-900" />
        </div>
      )}

      {!hasMore && filteredPosts.length > POSTS_PER_PAGE && (
        <p className="mt-16 text-center font-mono text-[10px] font-medium text-gray-300">
          {filteredPosts.length} articles
        </p>
      )}

      {filteredPosts.length === 0 && (
        <p className="py-24 text-center text-gray-400">No articles in this category.</p>
      )}
    </>
  )
}
