import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Commmonn Ground'

  // Truncate title if too long
  const displayTitle = title.length > 100 ? title.substring(0, 97) + '…' : title
  const fontSize = displayTitle.length > 70 ? 40 : displayTitle.length > 50 ? 48 : displayTitle.length > 30 ? 56 : 64

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: '#ffffff',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo — COMMMONN with COMM in purple, MONN in black */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: '#A3A5F1',
            }}
          >
            COMM
          </span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: '#18171A',
            }}
          >
            MONN
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
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
              paddingRight: '40px',
            }}
          >
            {displayTitle}
          </h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
