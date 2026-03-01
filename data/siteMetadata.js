/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Commmonn Ground',
  author: 'Commmonn',
  headerTitle: 'Commmonn Ground',
  description: 'Curated AI Research — Technology, Crypto, E-Commerce, and more.',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://blog-two-phi-88.vercel.app',
  siteRepo: 'https://github.com/mag-dot/blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.svg`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'magshumc@gmail.com',
  github: '',
  x: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  threads: '',
  instagram: '',
  medium: '',
  bluesky: '',
  locale: 'en-US',
  stickyNav: true,
  analytics: {},
  newsletter: {
    provider: '',
  },
  comments: {
    provider: '',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
