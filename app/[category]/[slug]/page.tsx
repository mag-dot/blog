import 'css/prism.css'
import 'katex/dist/katex.css'

import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { tagToCategorySlug, getArticlePath } from '@/lib/categorySlug'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slugStr = decodeURI(params.slug)
  const post = allBlogs.find((p) => p.slug === slugStr)
  if (!post) return

  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()

  const primaryTag = post.tags?.[0] || 'Research'
  const programmaticOg = `${siteMetadata.siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(primaryTag)}`

  // Prefer the original article image (imported from Wix) if available, otherwise use programmatic OG
  let ogImageUrl = programmaticOg
  if (post.images && post.images.length > 0) {
    const firstImage = typeof post.images === 'string' ? post.images : post.images[0]
    ogImageUrl = firstImage.includes('http') ? firstImage : `${siteMetadata.siteUrl}${firstImage}`
  }

  const articlePath = getArticlePath(post.tags, post.slug)

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}${articlePath}`,
      images: [{ url: ogImageUrl }],
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [ogImageUrl],
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => {
    const primaryTag = p.tags?.[0] || 'Research'
    return {
      category: tagToCategorySlug(primaryTag),
      slug: p.slug,
    }
  })
}

export default async function Page(props: {
  params: Promise<{ category: string; slug: string }>
}) {
  const params = await props.params
  const slugStr = decodeURI(params.slug)

  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slugStr)
  if (postIndex === -1) {
    return notFound()
  }

  // Verify category matches
  const postCore = sortedCoreContents[postIndex]
  const expectedCategory = tagToCategorySlug(postCore.tags?.[0] || 'Research')
  if (params.category !== expectedCategory) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slugStr) as Blog
  const mainContent = coreContent(post)
  const primaryTag = mainContent.tags?.[0]

  const relatedPosts = primaryTag
    ? sortedCoreContents
        .filter((p) => p.slug !== slugStr && p.tags?.includes(primaryTag))
        .slice(0, 5)
    : sortedCoreContents
        .filter((p) => p.slug !== slugStr)
        .slice(0, 5)

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const jsonLd = post.structuredData
  jsonLd['author'] = [{ '@type': 'Organization', name: 'Commmonn' }]

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        relatedPosts={relatedPosts}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
