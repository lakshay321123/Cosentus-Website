import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text = typeof body?.text === 'string' ? body.text.trim() : ''
    if (!text) return NextResponse.json({ error: 'Text must be a non-empty string' }, { status: 400 })

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

    const voiceId = '4qGY1svUBZLI7l8Ei9WW'

    // PR fix: Add timeout to prevent indefinite hangs
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.substring(0, 1000),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.60,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs error:', response.status, errText)
      return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
    })
  } catch (e) {
    console.error('TTS error:', e)
    return NextResponse.json({ error: 'TTS error' }, { status: 500 })
  }
}
