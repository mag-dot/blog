/**
 * Google AdSense configuration
 *
 * Replace the slot IDs below with real numeric IDs from your AdSense dashboard:
 *   AdSense → Ads → By ad unit → create/find each unit → copy the data-ad-slot number
 */

export const AD_CLIENT = 'ca-pub-8178097336205658'

export const AD_SLOTS = {
  /** In-article fluid ad — appears after 2nd paragraph (PostLayout) */
  articleInline: '3358922390',

  /** Appears at bottom of articles (PostLayout + PostSimple) */
  articleBottom: '3358922390',

  /** Appears in the homepage grid every 5 posts */
  homepageGrid: '3358922390',

  /** Multiplex ad — grid of recommended content-style ads at end of article */
  articleMultiplex: '3702483420',
} as const
