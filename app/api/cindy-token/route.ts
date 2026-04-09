import { NextResponse } from 'next/server'

const AGENT_ID = 'agent_4401knqw7z4ees28j1wgmdwq7t6r'

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 })
    }

    // Get signed URL for private agent
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs signed URL error:', response.status, errText)
      return NextResponse.json({ error: 'Failed to get conversation token', detail: errText }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ signedUrl: data.signed_url })
  } catch (e) {
    console.error('Cindy token error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
