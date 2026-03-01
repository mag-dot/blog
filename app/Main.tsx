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
    <div className={`flex items-center justify-center bg-gray-50 py-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
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
      {/* Category Filter Bar */}
      <div className="mb-10 overflow-x-auto border-b border-gray-200">
        <div className="flex gap-1 pb-3">
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
                className={`whitespace-nowrap px-3 py-1 text-xs font-medium tracking-widest uppercase transition-colors ${
                  activeCategory === cat
                    ? 'border-b-2 text-black'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
                style={activeCategory === cat ? { borderColor: '#5E61DE' } : {}}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {visiblePosts.map((post, index) => {
          const { slug, date, title, summary, tags, images } = post
          const heroImage = images?.[0] || null
          const primaryTag = tags?.[0] || 'Research'

          return (
            <div key={slug}>
              {/* Ad banner after every 5 articles */}
              {index > 0 && index % 5 === 0 && (
                <div className="mb-10 break-inside-avoid">
                  <AdBanner slot={`grid-${index}`} />
                </div>
              )}
              <article className="mb-10 break-inside-avoid">
                {heroImage && (
                  <Link href={`/blog/${slug}`} className="mb-3 block">
                    <img src={heroImage} alt={title} className="w-full object-cover" loading="lazy" />
                  </Link>
                )}
                <p className="mb-2 text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: '#5E61DE' }}>
                  {primaryTag}
                </p>
                <h2 className="mb-2 font-serif text-xl font-black leading-tight tracking-tight text-gray-900 lg:text-2xl">
                  <Link href={`/blog/${slug}`} className="hover:underline" style={{ textDecorationColor: '#5E61DE' }}>
                    {title}
                  </Link>
                </h2>
                <p className="mb-3 text-[15px] leading-relaxed text-gray-600">
                  {summary?.slice(0, 160)}
                  {summary && summary.length > 160 ? '...' : ''}
                </p>
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400">
                  {formatDate(date, siteMetadata.locale)}
                </p>
              </article>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300" style={{ borderTopColor: '#5E61DE' }} />
        </div>
      )}

      {!hasMore && filteredPosts.length > POSTS_PER_PAGE && (
        <p className="mt-12 text-center text-xs tracking-widest uppercase text-gray-400">
          All {filteredPosts.length} articles
        </p>
      )}

      {filteredPosts.length === 0 && (
        <p className="py-20 text-center text-gray-400">No articles in this category.</p>
      )}
    </>
  )
}
