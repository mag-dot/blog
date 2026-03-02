import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Commmonn Ground'
  const category = searchParams.get('category') || 'Research'

  // Load Geist font from Google Fonts
  const geistSemiBold = await fetch(
    new URL('https://fonts.googleapis.com/css2?family=Geist:wght@600&display=swap', req.url)
  ).then((res) => res.text()).catch(() => null)

  // Fallback: fetch font file directly from CDN
  const fontData = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-600-normal.woff'
  ).then((res) => res.arrayBuffer()).catch(() => null)

  const fontMono = await fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin-400-normal.woff'
  ).then((res) => res.arrayBuffer()).catch(() => null)

  const fonts: any[] = []
  if (fontData) {
    fonts.push({ name: 'Geist', data: fontData, style: 'normal', weight: 600 })
  }
  if (fontMono) {
    fonts.push({ name: 'GeistMono', data: fontMono, style: 'normal', weight: 400 })
  }

  // Truncate title if too long
  const displayTitle = title.length > 90 ? title.substring(0, 87) + '…' : title
  // Determine font size based on title length
  const fontSize = displayTitle.length > 60 ? 44 : displayTitle.length > 40 ? 52 : 60

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '80px',
          fontFamily: fonts.length > 0 ? 'Geist' : 'system-ui',
        }}
      >
        {/* Top: category label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: fonts.length > 1 ? 'GeistMono' : 'monospace',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9ca3af',
            }}
          >
            {category}
          </span>
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            paddingRight: '40px',
          }}
        >
          <h1
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
              color: '#111827',
              margin: 0,
            }}
          >
            {displayTitle}
          </h1>
        </div>

        {/* Bottom: logo + divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px',
          }}
        >
          {/* Logo text — recreating the SVG wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#111827',
              }}
            >
              comm
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#A3A5F1',
              }}
            >
              m
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#111827',
              }}
            >
              onn
            </span>
          </div>
          <span
            style={{
              fontFamily: fonts.length > 1 ? 'GeistMono' : 'monospace',
              fontSize: '12px',
              color: '#9ca3af',
            }}
          >
            blog-two-phi-88.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  )
}
