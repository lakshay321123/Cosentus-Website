import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'No text' }, { status: 400 })

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      console.error('ELEVENLABS_API_KEY not set')
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 })
    }

    const voiceId = '4qGY1svUBZLI7l8Ei9WW'

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=3&output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.substring(0, 500),
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.78,
          similarity_boost: 0.80,
          style: 0.0,
          use_speaker_boost: false,
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs error:', response.status, errText)
      return NextResponse.json({ error: 'TTS failed', status: response.status }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  } catch (e) {
    console.error('TTS error:', e)
    return NextResponse.json({ error: 'TTS error' }, { status: 500 })
  }
}
