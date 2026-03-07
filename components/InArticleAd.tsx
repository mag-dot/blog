'use client'

import { useEffect, useRef } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

export default function InArticleAd() {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adRef.current) return
    // Find the prose container (previous sibling)
    const prose = adRef.current.previousElementSibling
    if (!prose) return

    // Find all direct <p> children in the prose div
    const paragraphs = prose.querySelectorAll(':scope > p')
    if (paragraphs.length >= 2) {
      // Insert the ad after the 2nd paragraph
      const secondP = paragraphs[1]
      secondP.after(adRef.current)
      adRef.current.style.display = 'flex'
    }
  }, [])

  return (
    <div
      ref={adRef}
      className="my-8 items-center justify-center bg-gray-50 py-4"
      style={{ display: 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS.articleTop}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
