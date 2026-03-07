/**
 * Google AdSense configuration
 *
 * Replace the slot IDs below with real numeric IDs from your AdSense dashboard:
 *   AdSense → Ads → By ad unit → create/find each unit → copy the data-ad-slot number
 */

export const AD_CLIENT = 'ca-pub-8178097336205658'

export const AD_SLOTS = {
  /** Appears after 2nd paragraph inside articles (PostLayout) */
  articleTop: 'REPLACE_WITH_NUMERIC_SLOT_ID',

  /** Appears at bottom of articles (PostLayout + PostSimple) */
  articleBottom: 'REPLACE_WITH_NUMERIC_SLOT_ID',

  /** Appears in the homepage grid every 5 posts */
  homepageGrid: 'REPLACE_WITH_NUMERIC_SLOT_ID',
} as const
