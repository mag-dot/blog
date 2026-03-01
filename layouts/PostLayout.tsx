import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags, images } = content
  const basePath = path.split('/')[0]
  const heroImage = images?.[0] || null
  const primaryTag = tags?.[0] || 'Research'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-2xl">
        <header className="pt-10 pb-8">
          <p className="mb-3 font-mono text-[10px] font-medium tracking-wide uppercase text-gray-400">
            {primaryTag}
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

        {/* Ad after hero */}
        <div className="my-10 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8178097336205658" data-ad-slot="article-top" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="prose prose-gray max-w-none pb-10 text-[15px] leading-[1.8] text-gray-600">
          {children}
        </div>

        {/* Ad at end */}
        <div className="my-10 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8178097336205658" data-ad-slot="article-bottom" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {next && next.path && (
          <div className="border-t border-gray-100 pt-10 pb-10">
            <p className="mb-2 font-mono text-[10px] font-medium tracking-wide uppercase text-gray-300">
              Next
            </p>
            <h3 className="text-[20px] font-semibold text-gray-900" style={{ letterSpacing: '-0.03em' }}>
              <Link href={`/${next.path}`} className="hover:text-gray-600 transition-colors">
                {next.title}
              </Link>
            </h3>
          </div>
        )}

        <div className="pb-10">
          <Link href={`/${basePath}`} className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
            &larr; All articles
          </Link>
        </div>
      </article>
    </SectionContainer>
  )
}
