'use client'

import { useEffect, useRef } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

export default function InArticleAd() {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!adRef.current || pushed.current) return
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // adsbygoogle not loaded yet — OK
    }
  }, [])

  return (
    <div ref={adRef} className="my-8" style={{ textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS.articleInline}
      />
    </div>
  )
}
