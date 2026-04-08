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

    // Try text-to-speech with the selected voice
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // Limit text length to avoid timeouts
        model_id: 'eleven_turbo_v2_5', // Faster model for real-time voice
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs error:', response.status, errText)
      
      // If voice not found, try with a default voice
      if (response.status === 404 || errText.includes('voice_not_found')) {
        console.log('Voice not found, trying default voice Rachel...')
        const fallbackRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          body: JSON.stringify({
            text: text.substring(0, 500),
            model_id: 'eleven_turbo_v2_5',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        })
        
        if (fallbackRes.ok) {
          const audioBuffer = await fallbackRes.arrayBuffer()
          return new NextResponse(audioBuffer, {
            headers: { 'Content-Type': 'audio/mpeg' },
          })
        }
      }
      
      return NextResponse.json({ error: 'TTS failed', detail: errText }, { status: 500 })
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
