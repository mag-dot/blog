import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags, images } = content
  const heroImage = images?.[0] || null
  const primaryTag = tags?.[0] || 'Research'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-3xl">
        <header className="pt-8 pb-6">
          <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#5E61DE' }}>
            {primaryTag}
          </p>
          <PageTitle>{title}</PageTitle>
          <p className="mt-4 text-sm text-gray-400">
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          </p>
        </header>

        {heroImage && (
          <div className="mb-8">
            <img src={heroImage} alt={title} className="w-full rounded-sm object-cover" />
          </div>
        )}

        <div className="my-8 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="article-top" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        <div className="prose max-w-none pb-8 text-gray-700">{children}</div>

        <div className="my-8 flex items-center justify-center bg-gray-50 py-4">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="article-bottom" data-ad-format="auto" data-full-width-responsive="true" />
        </div>

        {next && next.path && (
          <div className="border-t border-gray-200 pt-10 pb-10">
            <p className="mb-2 text-xs font-medium tracking-widest uppercase text-gray-400">Keep Reading</p>
            <h3 className="font-serif text-2xl font-bold text-gray-900">
              <Link href={`/${next.path}`} className="hover:underline" style={{ textDecorationColor: '#5E61DE' }}>
                {next.title}
              </Link>
            </h3>
          </div>
        )}

        <div className="pb-8">
          <Link href="/" className="text-sm font-medium" style={{ color: '#5E61DE' }}>
            &larr; All articles
          </Link>
        </div>
      </article>
    </SectionContainer>
  )
}
