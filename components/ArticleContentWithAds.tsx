'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

/**
 * Wraps article content and injects in-article AdSense ad units
 * at specific positions relative to h2 elements:
 *   - Before the 2nd h2
 *   - Before the last h2
 *
 * Waits for DOM to be ready (h2s present) before injecting.
 */
export default function ArticleContentWithAds({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const injectedRef = useRef(false)

  useEffect(() => {
    if (injectedRef.current) return

    const injectAds = () => {
      const container = containerRef.current
      if (!container || injectedRef.current) return false

      const h2s = container.querySelectorAll('h2')
      if (h2s.length < 2) return false

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
        return wrapper
      }

      const pushAd = () => {
        try {
          ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        } catch {
          // adsbygoogle not loaded yet
        }
      }

      // Before 2nd h2 (index 1)
      if (h2s.length >= 2) {
        const ad = createAdUnit()
        h2s[1].parentNode?.insertBefore(ad, h2s[1])
        pushAd()
      }

      // Before last h2 — skip if last IS the 2nd (avoid double ad)
      const lastIndex = h2s.length - 1
      if (lastIndex !== 1) {
        const ad = createAdUnit()
        h2s[lastIndex].parentNode?.insertBefore(ad, h2s[lastIndex])
        pushAd()
      }

      return true
    }

    // Try immediately after paint
    requestAnimationFrame(() => {
      if (injectAds()) return

      // If h2s not ready yet (SSR hydration delay), observe for changes
      const container = containerRef.current
      if (!container) return

      const observer = new MutationObserver(() => {
        if (injectAds()) {
          observer.disconnect()
        }
      })

      observer.observe(container, { childList: true, subtree: true })

      // Cleanup after 10s regardless
      setTimeout(() => observer.disconnect(), 10000)
    })
  }, [])

  return <div ref={containerRef}>{children}</div>
}
