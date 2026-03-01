export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <p className="mb-2 text-[11px] font-medium tracking-wide uppercase text-gray-400">About</p>
        <p className="mb-10 text-[14px] leading-relaxed text-gray-500">
          AI tools like Grok and ChatGPT accelerate discovery, offering unique perspectives on
          complex topics. Commmonn harnesses these technologies to curate exploratory findings,
          blending innovation with curiosity.
        </p>

        <p className="mb-2 text-[11px] font-medium tracking-wide uppercase text-gray-400">Disclaimer</p>
        <p className="mb-10 text-[13px] leading-relaxed text-gray-400">
          Content is generated or curated with AI assistance for informational purposes only. It does
          not constitute professional advice. Always verify facts independently and consult qualified
          professionals before making decisions.
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-300">
            &copy; {new Date().getFullYear()} Commmonn Ground
          </p>
          <p className="text-[11px] text-gray-300">Research</p>
        </div>
      </div>
    </footer>
  )
}
