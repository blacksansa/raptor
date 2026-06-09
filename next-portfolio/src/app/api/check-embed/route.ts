import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 })

    // Try a HEAD request first to avoid downloading full body
    const controller = new AbortController()
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: controller.signal })

    const xFrame = res.headers.get('x-frame-options') || res.headers.get('X-Frame-Options')
    const csp = res.headers.get('content-security-policy') || ''

    const embeddable = res.status >= 200 && res.status < 400 && !xFrame && !/frame-ancestors\s+'none'/.test(csp)

    return NextResponse.json({ embeddable, status: res.status, xFrameOptions: xFrame ?? null, csp })
  } catch (e: any) {
    return NextResponse.json({ embeddable: false, error: String(e) }, { status: 500 })
  }
}
