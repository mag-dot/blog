/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Commmonn Ground',
  author: 'Commmonn',
  headerTitle: 'Commmonn Ground',
  description: 'AI-powered research exploring Technology, Crypto, E-Commerce, Investing, and more. Curated insights blending innovation with curiosity.',
  language: 'en-us',
  theme: 'light',
  siteUrl: 'https://blog-two-phi-88.vercel.app',
  siteRepo: 'https://github.com/mag-dot/blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.svg`,
  socialBanner: `/og?title=${encodeURIComponent('Commmonn Ground')}&category=${encodeURIComponent('AI-powered research exploring Technology, Crypto, E-Commerce, Investing, and more.')}`,
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
