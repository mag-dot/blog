/**
 * Maps tag names to URL-safe category slugs for /{category}/{slug} routing.
 */

const TAG_TO_SLUG: Record<string, string> = {
  'Tech & AI': 'tech-ai',
  'Crypto & Bitcoin': 'crypto',
  'E-Commerce': 'e-commerce',
  'Invest': 'invest',
  'Child Development': 'child-development',
  'Food & Health': 'food-health',
  'Travel': 'travel',
  'Auto': 'auto',
  'Fact Check': 'fact-check',
  'Research': 'research',
}

const SLUG_TO_TAG: Record<string, string> = Object.fromEntries(
  Object.entries(TAG_TO_SLUG).map(([k, v]) => [v, k])
)

export function tagToCategorySlug(tag: string): string {
  return TAG_TO_SLUG[tag] || tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function categorySlugToTag(slug: string): string | undefined {
  return SLUG_TO_TAG[slug]
}

export function getArticlePath(tags: string[] | undefined, slug: string): string {
  const primaryTag = tags?.[0] || 'Research'
  return `/${tagToCategorySlug(primaryTag)}/${slug}`
}
