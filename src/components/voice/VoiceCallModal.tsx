'use client'

/**
 * VoiceCallModal
 * --------------
 * Ported from the Cosentus.ai marketing site (lakshay321123/Cosentus.ai),
 * specifically /tmp/cosentus-ai-ref/agents.jsx CallModal component, with
 * styles in /tmp/cosentus-ai-ref/styles.css lines 939-1308.
 *
 * Behavior — exact replica of reference:
 *   1. Modal opens centered with dark glass overlay (FaceTime/Zoom paradigm).
 *      User explicitly approved this dark UI for the call experience even
 *      though the host page is light. See chat: "you can use the color
 *      shown here if you want, or you can copy and paste it if you prefer".
 *   2. Avatar 160px with rotating conic ring underneath + breathing pulse.
 *      3 expanding rings ONLY animate when SDK fires agent_start_talking.
 *   3. INTAKE AGENT eyebrow (uppercase teal letter-spaced) + name H2 (bold).
 *   4. Status: green pulse dot + text — Ready / Connecting / Connected · MM:SS.
 *   5. 28-bar waveform — animates only during agent_start_talking.
 *   6. Italic transcript box — updates from Retell update events.
 *   7. Connect button (frosted glass) on idle. Mute + End buttons on connected.
 *      Cancel button on connecting/error states. End button has red border + red icon.
 *   8. ESC key closes. Click backdrop closes.
 *
 * Retell SDK is loaded on first mount via dynamic <script type="module">
 * pulling https://esm.sh/retell-client-js-sdk@2.0.7 — same source the
 * reference uses. Backend register-call endpoint is the existing
 * https://cosentusai.vercel.app/api/retell/register-call (verified
 * working in reference repo). If CORS blocks this from main domain,
 * we proxy through a Next.js API route in a follow-up.
 *
 * Honest gap: only 'Chris' and 'Cindy' on the homepage have exact-name
 * matches with reference Retell agentIds. The other 7 agents have
 * agentId: null and will show 'Demo' state on Connect — modal still
 * works visually but no real voice call. User to provision real Retell
 * agents for the 9 homepage personas later.
 */

import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Type declarations for Retell SDK on window
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    RetellWebClient?: new () => RetellClient
  }
}
interface RetellClient {
  startCall: (opts: { accessToken: string; sampleRate?: number }) => Promise<void>
  stopCall: () => void
  mute: () => void
  unmute: () => void
  on: (event: string, handler: (...args: unknown[]) => void) => void
}

// ---------------------------------------------------------------------------
// Public Agent type — passed in by RASection
// ---------------------------------------------------------------------------
export interface VoiceAgent {
  name: string
  role: string         // displayed in modal eyebrow as "{role} AGENT"
  img: string          // filename in /public/images/
  agentId: string | null  // Retell agent_xxx id, or null = demo mode
  greeting: string     // initial transcript text shown before SDK update
}

// ---------------------------------------------------------------------------
// Waveform — 28 bars, animation gated by .is-active class
// ---------------------------------------------------------------------------
function CallWaveform({ isActive }: { isActive: boolean }) {
  const bars = 28
  return (
    <div className={`call-waveform${isActive ? ' is-active' : ''}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          className="bar"
          key={i}
          style={{
            animationDelay: `${(i * 0.05) % 0.7}s`,
            animationDuration: `${0.8 + (i % 5) * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
type Status = 'idle' | 'connecting' | 'connected' | 'ended' | 'error' | 'demo'

export default function VoiceCallModal({
  agent,
  onClose,
}: {
  agent: VoiceAgent
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [muted, setMuted] = useState(false)
  const [transcript, setTranscript] = useState(agent.greeting)
  const [agentTalking, setAgentTalking] = useState(false)
  const clientRef = useRef<RetellClient | null>(null)

  // ---- Force-stop residual audio playback. ----
  // The Retell SDK creates an <audio> element with srcObject = MediaStream
  // for the WebRTC remote audio track. When stopCall() is called the peer
  // connection closes, but the audio element + MediaStream tracks are NOT
  // automatically stopped — they continue playing whatever is buffered
  // (this is the disconnect bug Lakshay reported: "when I disconnect, also
  // it's still speaking"). Calling track.stop() on every active audio
  // MediaStream cuts the audio at its source. Targeted to audio elements
  // with srcObject set, so it won't affect any future <audio src=...> usage.
  const teardownAudio = () => {
    if (typeof document === 'undefined') return
    document.querySelectorAll('audio').forEach(audio => {
      const stream = audio.srcObject as MediaStream | null
      if (stream && typeof stream.getTracks === 'function') {
        try {
          stream.getTracks().forEach(track => {
            try { track.stop() } catch { /* ignore individual track */ }
          })
        } catch { /* ignore */ }
      }
      try { audio.pause() } catch { /* ignore */ }
      try { audio.srcObject = null } catch { /* ignore */ }
    })
  }

  // ---- Load Retell SDK once on first mount of any modal instance ----
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.RetellWebClient) return
    if (document.querySelector('script[data-retell-sdk]')) return

    const script = document.createElement('script')
    script.type = 'module'
    script.dataset.retellSdk = 'true'
    script.textContent = `
      import { RetellWebClient } from "https://esm.sh/retell-client-js-sdk@2.0.7";
      window.RetellWebClient = RetellWebClient;
    `
    document.head.appendChild(script)
  }, [])

  // ---- Connect button handler — fires register-call + startCall ----
  const handleConnect = async () => {
    setStatus('connecting')
    setErrorMsg('')

    // Wait briefly for SDK if a fast clicker beat the script load
    let SDK = window.RetellWebClient
    for (let i = 0; i < 30 && typeof SDK !== 'function'; i++) {
      await new Promise(r => setTimeout(r, 100))
      SDK = window.RetellWebClient
    }
    if (typeof SDK !== 'function') {
      setStatus('demo')
      return
    }

    // Honest gap: only Chris + Cindy have real Retell agentIds wired up.
    // For unmapped homepage agents we fall to demo state — modal stays
    // open with elapsed timer + End button, no real voice call.
    if (!agent.agentId) {
      setStatus('demo')
      return
    }

    try {
      const res = await fetch('https://cosentusai.vercel.app/api/retell/register-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.agentId }),
      })
      const data = (await res.json().catch(() => ({}))) as { accessToken?: string; error?: string }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      if (!data.accessToken) throw new Error('No access token from server')

      const client = new SDK()
      clientRef.current = client

      client.on('call_started', () => setStatus('connected'))
      client.on('call_ended', () => {
        setStatus('ended')
        setAgentTalking(false)
        teardownAudio()  // stop residual MediaStream playback immediately
      })
      client.on('error', (err: unknown) => {
        setStatus('error')
        const msg = err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Call error'
        setErrorMsg(msg)
        setAgentTalking(false)
      })
      client.on('agent_start_talking', () => setAgentTalking(true))
      client.on('agent_stop_talking', () => setAgentTalking(false))
      client.on('update', (update: unknown) => {
        try {
          if (update && typeof update === 'object' && 'transcript' in update) {
            const t = (update as { transcript: unknown }).transcript
            if (Array.isArray(t) && t.length > 0) {
              const last = t[t.length - 1] as { content?: unknown } | undefined
              if (last && typeof last.content === 'string' && last.content.trim()) {
                setTranscript(last.content)
              }
            }
          }
        } catch {
          /* ignore malformed updates */
        }
      })

      await client.startCall({ accessToken: data.accessToken, sampleRate: 24000 })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start call')
    }
  }

  // ---- Cleanup on unmount: stop call + force-stop residual audio ----
  useEffect(() => {
    return () => {
      const c = clientRef.current
      if (c) {
        try { c.stopCall() } catch { /* ignore */ }
      }
      clientRef.current = null
      teardownAudio()
    }
  }, [])

  // ---- Elapsed timer — runs only in connected + demo states ----
  useEffect(() => {
    if (status !== 'connected' && status !== 'demo') return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  // ---- ESC key closes ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // ---- Auto-close shortly after call ends ----
  useEffect(() => {
    if (status !== 'ended') return
    const t = setTimeout(onClose, 1500)
    return () => clearTimeout(t)
  }, [status, onClose])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const statusText =
    status === 'idle'       ? 'Ready to connect' :
    status === 'connecting' ? 'Connecting…' :
    status === 'connected'  ? `Connected · ${mm}:${ss}` :
    status === 'demo'       ? `Demo · ${mm}:${ss}` :
    status === 'ended'      ? 'Call ended' :
    status === 'error'      ? (errorMsg ? `Failed — ${errorMsg}` : 'Failed') :
    ''

  const handleMute = () => {
    const next = !muted
    setMuted(next)
    const c = clientRef.current
    if (!c) return
    try { next ? c.mute() : c.unmute() } catch { /* ignore */ }
  }

  const handleEnd = () => {
    // Freeze visual state immediately so rings/waveform stop animating
    setAgentTalking(false)
    // Stop the SDK call (closes WebRTC peer)
    const c = clientRef.current
    if (c) { try { c.stopCall() } catch { /* ignore */ } }
    clientRef.current = null
    // Force-kill any residual MediaStream audio playback
    teardownAudio()
    onClose()
  }

  return (
    <div className="call-backdrop" onClick={onClose}>
      <div className="call-card" onClick={(e) => e.stopPropagation()}>
        <button className="call-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className={`call-avatar-wrap${agentTalking ? ' is-talking' : ''}`}>
          <div className="call-avatar-ring" />
          <div className="call-avatar-ring delay1" />
          <div className="call-avatar-ring delay2" />
          <div
            className="call-avatar"
            style={{ backgroundImage: `url('/images/${agent.img}')` }}
          />
        </div>

        <div>
          <p className="call-role">{agent.role} Agent</p>
          <h2 className="call-name">{agent.name}</h2>
        </div>

        <div className="call-status">
          <span className="dot" />
          <span>{statusText}</span>
        </div>

        <CallWaveform isActive={agentTalking} />

        <div className="call-prompt">
          <strong>{agent.name}:</strong> {transcript}
        </div>

        {status === 'idle' && (
          <div className="call-actions">
            <button className="call-btn connect" onClick={handleConnect} aria-label="Connect">
              <span>Connect</span>
            </button>
          </div>
        )}

        {(status === 'connected' || status === 'demo') && (
          <div className="call-actions">
            <button
              className={`call-btn mute ${muted ? 'on' : ''}`}
              onClick={handleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              )}
            </button>
            <button className="call-btn end" onClick={handleEnd} aria-label="End call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" />
              </svg>
            </button>
          </div>
        )}

        {(status === 'connecting' || status === 'error') && (
          <div className="call-actions">
            <button className="call-btn end" onClick={handleEnd} aria-label="Cancel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
