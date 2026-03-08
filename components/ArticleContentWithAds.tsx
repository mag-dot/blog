'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

/**
 * Wraps article content and injects in-article AdSense ad units
 * at specific positions relative to h2 elements:
 *   - Before the 3rd h2
 *   - Before the last h2
 *
 * Uses DOM injection after hydration — ads are client-side anyway.
 */
export default function ArticleContentWithAds({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const injectedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || injectedRef.current) return

    const container = containerRef.current
    const h2s = container.querySelectorAll('h2')

    if (h2s.length < 2) return

    injectedRef.current = true

    const createAdUnit = () => {
      const wrapper = document.createElement('div')
      wrapper.className = 'my-8'
      wrapper.style.textAlign = 'center'

      const ins = document.createElement('ins')
      ins.className = 'adsbygoogle'
      ins.style.display = 'block'
      ins.style.textAlign = 'center'
      ins.setAttribute('data-ad-layout', 'in-article')
      ins.setAttribute('data-ad-format', 'fluid')
      ins.setAttribute('data-ad-client', AD_CLIENT)
      ins.setAttribute('data-ad-slot', AD_SLOTS.articleInline)

      wrapper.appendChild(ins)

      // Push ad
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch {
        // adsbygoogle not loaded yet
      }

      return wrapper
    }

    // Before 3rd h2 (index 2)
    if (h2s.length >= 3) {
      const ad = createAdUnit()
      h2s[2].parentNode?.insertBefore(ad, h2s[2])
    }

    // Before last h2 — skip if last IS the 3rd (avoid double ad)
    const lastIndex = h2s.length - 1
    if (lastIndex !== 2) {
      const ad = createAdUnit()
      h2s[lastIndex].parentNode?.insertBefore(ad, h2s[lastIndex])
    }
  }, [])

  return <div ref={containerRef}>{children}</div>
}
