'use client'

import { useEffect, useRef, useState } from 'react'
import { AD_CLIENT, AD_SLOTS } from '@/lib/adConfig'

export default function StickyAnchorAd() {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!adRef.current || pushed.current) return
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // adsbygoogle not loaded yet — OK
    }
  }, [])

  if (dismissed) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.08)]"
      style={{ borderTop: '1px solid #eee' }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors text-xs leading-none"
        aria-label="Close ad"
      >
        ✕
      </button>
      <div ref={adRef} className="w-full max-w-[728px] py-1">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={AD_SLOTS.stickyAnchor}
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  )
}
