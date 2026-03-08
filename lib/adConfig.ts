/**
 * Google AdSense configuration
 *
 * Replace the slot IDs below with real numeric IDs from your AdSense dashboard:
 *   AdSense → Ads → By ad unit → create/find each unit → copy the data-ad-slot number
 */

export const AD_CLIENT = 'ca-pub-8178097336205658'

export const AD_SLOTS = {
  /** In-article fluid ad — injected before 3rd h2 and before last h2 */
  articleInline: '3358922390',

  /** Appears at bottom of articles, after "All articles" link, before footer */
  articleBottom: '3358922390',

  /** Appears in the homepage grid every 5 posts */
  homepageGrid: '3358922390',

  /** Multiplex ad — after "All articles" link, before footer */
  articleMultiplex: '3702483420',
} as const
