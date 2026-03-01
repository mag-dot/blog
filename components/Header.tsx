import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-white/90 backdrop-blur-sm py-4 border-b border-gray-100">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <img src="/static/images/logo.svg" alt="Commmonn Ground" className="h-6" />
      </Link>
      <div className="absolute right-4">
        <SearchButton />
      </div>
    </header>
  )
}

export default Header
