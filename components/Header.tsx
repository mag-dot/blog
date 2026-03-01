import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-gray-200 bg-white py-5">
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <img src="/static/images/logo.svg" alt="Commmonn Ground" className="h-7" />
      </Link>
      <div className="absolute right-4">
        <SearchButton />
      </div>
    </header>
  )
}

export default Header
