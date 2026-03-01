import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h3 className="mb-4 text-xs font-semibold tracking-widest uppercase text-gray-900">
          Why AI Research
        </h3>
        <p className="mb-8 text-sm leading-relaxed text-gray-500">
          AI tools like Grok and ChatGPT accelerate discovery, offering unique perspectives on
          complex topics. Commmonn harnesses these technologies to curate exploratory findings,
          blending innovation with curiosity. While not flawless, AI-powered insights provide a
          starting point for deeper understanding — always evolving, always transparent.
        </p>

        <h3 className="mb-4 text-xs font-semibold tracking-widest uppercase text-gray-900">
          Disclaimer
        </h3>
        <p className="mb-8 text-xs leading-relaxed text-gray-400">
          The content published on Commmonn Ground is generated or curated with the assistance of AI
          tools and is intended for informational and exploratory purposes only. It does not
          constitute professional advice — financial, medical, legal, or otherwise. Always verify
          facts independently and consult qualified professionals before making decisions. Commmonn
          Ground is not responsible for any actions taken based on the content provided.
        </p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <p className="text-xs tracking-wide text-gray-400">
            &copy; {new Date().getFullYear()} COMMMONN GROUND
          </p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>RESEARCH</span>
            <span>|</span>
            <span>DISCLAIMER</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
