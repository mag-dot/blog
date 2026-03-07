'use client'

import { useEffect, useRef } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

export default function MultiplexAd() {
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
    <div ref={adRef} className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS.articleMultiplex}
      />
    </div>
  )
}
