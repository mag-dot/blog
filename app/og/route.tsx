import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Logo SVG as base64 data URI
const LOGO_SVG_BASE64 = 'PHN2ZyB3aWR0aD0iNzgwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDc4MCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODkiIGhlaWdodD0iMTEzIiBmaWxsPSIjQTNBNUYxIi8+CjxwYXRoIGQ9Ik03MS4zMTA2IDQ2LjQyNkM2OS42NzI2IDM2LjU5OCA2NS4xMzY2IDI5LjQxNiA1My4xNjY2IDI5LjQxNkMzOC4xNzI2IDI5LjQxNiAzMy4xMzI2IDQxLjAwOCAzMy4xMzI2IDU3Ljg5MkMzMy4xMzI2IDc0LjkwMiAzOC4xNzI2IDg2LjQ5NCA1My4xNjY2IDg2LjQ5NEM2NS4yNjI2IDg2LjQ5NCA2OS43OTg2IDc5LjMxMiA3MS4zMTA2IDY5LjIzMkg5My45OTA2QzkxLjk3NDYgOTAuNCA3OC44NzA2IDEwNS4wMTYgNTQuMTc0NiAxMDUuMDE2QzI1LjY5ODYgMTA1LjAxNiAxMC40NTI2IDg1LjEwOCAxMC40NTI2IDU3Ljg5MkMxMC40NTI2IDMwLjgwMiAyNS42OTg2IDEwLjg5NCA1NC4xNzQ2IDEwLjg5NEM3OC43NDQ2IDEwLjg5NCA5MS44NDg2IDI1LjUxIDkzLjk5MDYgNDYuNDI2SDcxLjMxMDZaTTE0Mi45MTIgMTA1LjAxNkMxMTQuMzEgMTA1LjAxNiA5OC4zMDgxIDg1LjEwOCA5OC4zMDgxIDU3Ljg5MkM5OC4zMDgxIDMwLjgwMiAxMTQuMzEgMTAuODk0IDE0Mi45MTIgMTAuODk0QzE3MS4yNjIgMTAuODk0IDE4Ny41MTYgMzAuODAyIDE4Ny41MTYgNTcuODkyQzE4Ny41MTYgODUuMTA4IDE3MS4yNjIgMTA1LjAxNiAxNDIuOTEyIDEwNS4wMTZaTTE0Mi45MTIgODYuNDk0QzE1OS4yOTIgODYuNDk0IDE2NC44MzYgNzMuNjQyIDE2NC44MzYgNTcuODkyQzE2NC44MzYgNDIuMjY4IDE1OS4yOTIgMjkuNDE2IDE0Mi45MTIgMjkuNDE2QzEyNi40MDYgMjkuNDE2IDEyMC45ODggNDIuMjY4IDEyMC45ODggNTcuODkyQzEyMC45ODggNzMuNjQyIDEyNi40MDYgODYuNDk0IDE0Mi45MTIgODYuNDk0Wk0xOTYuMjE2IDEwM1YxMi45MUgyMjMuOTM2TDI0Mi40NTggNzAuMzY2SDI0Mi43MUwyNjEuMjMyIDEyLjkxSDI4OC45NTJWMTAzSDI2Ny41MzJWNDYuOTNIMjY3LjI4TDI1MC41MjIgMTAzSDIzNC42NDZMMjE3Ljg4OCA0Ni45M0gyMTcuNjM2VjEwM0gxOTYuMjE2Wk0zMDEuMjk4IDEwM1YxMi45MUgzMjkuMDE4TDM0Ny41NCA3MC4zNjZIMzQ3Ljc5MkwzNjYuMzE0IDEyLjkxSDM5NC4wMzRWMTAzSDM3Mi42MTRWNDYuOTNIMzcyLjM2MkwzNTUuNjA0IDEwM0gzMzkuNzI4TDMyMi45NyA0Ni45M0gzMjIuNzE4VjEwM0gzMDEuMjk4Wk00MDYuMzggMTAzVjEyLjkxSDQzNC4xTDQ1Mi42MjIgNzAuMzY2SDQ1Mi44NzRMNDcxLjM5NiAxMi45MUg0OTkuMTE2VjEwM0g0NzcuNjk2VjQ2LjkzSDQ3Ny40NDRMNDYwLjY4NiAxMDNINDQ0LjgxTDQyOC4wNTIgNDYuOTNINDI3LjhWMTAzSDQwNi4zOFpNNTUzLjAyNyAxMDUuMDE2QzUyNC40MjUgMTA1LjAxNiA1MDguNDIzIDg1LjEwOCA1MDguNDIzIDU3Ljg5MkM1MDguNDIzIDMwLjgwMiA1MjQuNDI1IDEwLjg5NCA1NTMuMDI3IDEwLjg5NEM1ODEuMzc3IDEwLjg5NCA1OTcuNjMxIDMwLjgwMiA1OTcuNjMxIDU3Ljg5MkM1OTcuNjMxIDg1LjEwOCA1ODEuMzc3IDEwNS4wMTYgNTUzLjAyNyAxMDUuMDE2Wk01NTMuMDI3IDg2LjQ5NEM1NjkuNDA3IDg2LjQ5NCA1NzQuOTUxIDczLjY0MiA1NzQuOTUxIDU3Ljg5MkM1NzQuOTUxIDQyLjI2OCA1NjkuNDA3IDI5LjQxNiA1NTMuMDI3IDI5LjQxNkM1MzYuNTIxIDI5LjQxNiA1MzEuMTAzIDQyLjI2OCA1MzEuMTAzIDU3Ljg5MkM1MzEuMTAzIDczLjY0MiA1MzYuNTIxIDg2LjQ5NCA1NTMuMDI3IDg2LjQ5NFpNNjA2LjMzMSAxMDNWMTIuOTFINjI5LjAxMUw2NjAuNTExIDY2LjQ2SDY2MC43NjNWMTIuOTFINjgzLjQ0M1YxMDNINjYwLjc2M0w2MjkuMjYzIDQ5LjQ1SDYyOS4wMTFWMTAzSDYwNi4zMzFaTTY5NS43ODYgMTAzVjEyLjkxSDcxOC40NjZMNzQ5Ljk2NiA2Ni40Nkg3NTAuMjE4VjEyLjkxSDc3Mi44OThWMTAzSDc1MC4yMThMNzE4LjcxOCA0OS40NUg3MTguNDY2VjEwM0g2OTUuNzg2WiIgZmlsbD0iIzE4MTcxQSIvPgo8L3N2Zz4K'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') || 'Commmonn Ground'

  // Load Geist Medium (500) font
  let geistFont: ArrayBuffer | null = null
  try {
    const res = await fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-500-normal.woff'
    )
    if (res.ok) geistFont = await res.arrayBuffer()
  } catch {}

  // Fixed 60px, max 3 lines, truncate at ~150 chars
  const displayTitle = title.length > 150 ? title.substring(0, 147) + '…' : title

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
          padding: '72px 80px',
          fontFamily: geistFont ? 'Geist' : 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo — exact SVG, natural aspect ratio 780:113 */}
        <div style={{ display: 'flex', height: '30px' }}>
          <img
            src={`data:image/svg+xml;base64,${LOGO_SVG_BASE64}`}
            height={30}
            width={207}
          />
        </div>

        {/* Title — fixed 60px, flows to max 3 lines */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            marginTop: '24px',
          }}
        >
          <span
            style={{
              fontSize: '60px',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#18171A',
              maxWidth: '1040px',
              overflow: 'hidden',
            }}
          >
            {displayTitle}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: geistFont
        ? [{ name: 'Geist', data: geistFont, style: 'normal' as const, weight: 500 }]
        : undefined,
    }
  )
}
