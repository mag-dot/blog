import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Commmonn Ground'
  const category = searchParams.get('category') || 'Research'

  // Truncate title if too long
  const displayTitle = title.length > 90 ? title.substring(0, 87) + '…' : title
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
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: category label */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              fontFamily: 'monospace',
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>
              comm
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: '#A3A5F1' }}>
              m
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>
              onn
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>
            blog-two-phi-88.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
