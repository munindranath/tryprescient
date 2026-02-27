'use client'
import { useState, useEffect, useRef } from 'react'

const G = '#00ff87'   // green
const A = '#ffb800'   // amber
const D = '#444'      // dim
const W = '#e0e0e0'   // white

type Line = { text: string; color: string; delay: number }

const BOOT_LINES: Line[] = [
  { delay: 0,    text: 'prescient v0.1.0-beta',                          color: W },
  { delay: 200,  text: 'connecting to prometheus:9090...',                color: D },
  { delay: 900,  text: '✓ connected — 1,247 metrics indexed',            color: G },
  { delay: 1100, text: 'building adaptive baselines...',                  color: D },
  { delay: 1800, text: '✓ baselines ready — watching.',                   color: G },
  { delay: 2200, text: '',                                                color: D },
  { delay: 2400, text: '⚠  anomaly detected',                            color: A },
  { delay: 2600, text: '   metric: checkout_latency_p99',                 color: D },
  { delay: 2800, text: '   current: 3,240ms  baseline: 740ms  +338%',    color: A },
  { delay: 3100, text: '',                                                color: D },
  { delay: 3300, text: 'investigating...',                                color: D },
  { delay: 4200, text: '→ cross-correlating 47 related metrics',         color: D },
  { delay: 4800, text: '→ searching incident memory (3 matches)',        color: D },
  { delay: 5400, text: '',                                                color: D },
  { delay: 5600, text: 'root cause hypothesis (confidence: 0.91)',       color: W },
  { delay: 5800, text: '   cart-service OOM → connection pool exhausted', color: D },
  { delay: 6000, text: '   cascading to checkout — same pattern as 2025-11-03', color: D },
  { delay: 6200, text: '',                                                color: D },
  { delay: 6400, text: 'suggested remediation [risk: LOW]',               color: G },
  { delay: 6600, text: '   kubectl rollout restart deployment/cart',      color: G },
  { delay: 6800, text: '',                                                color: D },
  { delay: 7000, text: 'auto-executing in 5s  (ctrl+z to cancel)',       color: D },
  { delay: 7500, text: '...',                                             color: D },
  { delay: 8500, text: '✓ rollout complete — latency returning to baseline', color: G },
  { delay: 8800, text: '✓ resolved in 52s — on-call not paged.',         color: G },
]

function TerminalPage() {
  const [lines, setLines] = useState<Line[]>([])
  const [phase, setPhase] = useState<'booting' | 'done' | 'waitlist'>('booting')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line])
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setPhase('done'), 1200)
        }
      }, line.delay)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines, phase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }) } catch {}
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '48px 32px 80px',
      maxWidth: 680,
      margin: '0 auto',
      fontSize: 13,
      lineHeight: '1.9',
      letterSpacing: '0.01em',
    }}>

      {/* header */}
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: G, fontWeight: 500, fontSize: 14 }}>prescient</span>
        <a href="https://github.com/munindranath/prescient" target="_blank" rel="noopener noreferrer"
          style={{ color: D, fontSize: 12, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#666')}
          onMouseLeave={e => (e.currentTarget.style.color = D)}>
          github ↗
        </a>
      </div>

      {/* tagline */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ color: W, fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          knows before you ask.
        </p>
        <p style={{ color: D, marginTop: 10, fontSize: 12, maxWidth: 440 }}>
          AI SRE agent — detects anomalies, investigates root cause, remediates.
          <br />before your on-call gets paged.
        </p>
      </div>

      {/* terminal output */}
      <div style={{ marginBottom: 40 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.color, minHeight: '1.9em' }} className="line">
            {line.text}
          </div>
        ))}

        {/* cursor while booting */}
        {phase === 'booting' && lines.length > 0 && (
          <span style={{ color: G }} className="blink">▊</span>
        )}

        {/* waitlist prompt */}
        {phase === 'done' && !submitted && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: D, marginBottom: 8 }}>
              — want early access?
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: G }}>$</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #222',
                  color: W,
                  fontFamily: 'inherit',
                  fontSize: 13,
                  outline: 'none',
                  padding: '2px 4px',
                  width: 240,
                }}
                onFocus={e => { e.target.style.borderBottomColor = G }}
                onBlur={e => { e.target.style.borderBottomColor = '#222' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: G,
                  fontFamily: 'inherit',
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? 'joining...' : '[enter]'}
              </button>
            </form>
          </div>
        )}

        {phase === 'done' && submitted && (
          <div style={{ marginTop: 24, color: G }}>
            ✓ you are on the list. we will reach out before launch.
          </div>
        )}

        {(phase === 'done' || submitted) && (
          <div ref={bottomRef} />
        )}
      </div>

      {/* footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 32px', borderTop: '1px solid #0e0e0e' }}>
        <span style={{ fontSize: 11, color: '#1e1e1e' }}>© 2026 prescient · open-source · MIT</span>
      </div>

    </div>
  )
}

export default TerminalPage
