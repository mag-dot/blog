import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { getArticlePath } from '@/lib/categorySlug'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  relatedPosts?: CoreContent<Blog>[]
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, relatedPosts, children }: LayoutProps) {
  const { slug, date, title, tags, images } = content
  const heroImage = images?.[0] || null
  const primaryTag = tags?.[0] || 'Research'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-2xl">
        <header className="pt-10 pb-8">
          <p className="mb-3">
            <span className="inline-block border border-[#A3A5F1] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-[#5E61DE]">
              {primaryTag}
            </span>
          </p>
          <h1 className="text-[32px] font-semibold leading-[1.15] text-gray-900 lg:text-[40px]" style={{ letterSpacing: '-0.04em' }}>
            {title}
          </h1>
          <p className="mt-4 font-mono text-[12px] text-gray-400">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
            </time>
          </p>
        </header>

        {heroImage && (
          <div className="mb-10">
            <img src={heroImage} alt={title} className="w-full object-cover" />
          </div>
        )}

        <div className="my-10 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8178097336205658" data-ad-slot="article-top" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="prose prose-gray prose-headings:font-semibold prose-h2:text-[24px] prose-h2:leading-tight prose-h3:text-[20px] prose-h3:leading-snug prose-h4:text-[17px] prose-h5:text-[15px] max-w-none pb-10 text-[15px] leading-[1.8] text-gray-600">
          {children}
        </div>

        <div className="my-10 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8178097336205658" data-ad-slot="article-bottom" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {/* Keep Reading — 5 articles from same category */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="border-t border-gray-100 pt-10 pb-10">
            <p className="mb-6 font-mono text-[10px] font-medium tracking-wide uppercase text-gray-300">
              Keep Reading
            </p>
            <div className="space-y-6">
              {relatedPosts.map((post) => (
                <div key={post.slug}>
                  <h3 className="text-[17px] font-semibold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                    <Link href={getArticlePath(post.tags, post.slug)} className="hover:text-[#5E61DE] transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-gray-300">
                    {new Date(post.date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pb-10">
          <Link href="/" className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
            &larr; All articles
          </Link>
        </div>
      </article>
    </SectionContainer>
  )
}
