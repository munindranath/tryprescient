'use client'
import { useState, useEffect, useRef } from 'react'

const G = '#00ff87'
const A = '#ffb800'
const D = '#444'
const W = '#e0e0e0'

const DEMO_LINES = [
  { delay: 0,    text: '$ prescient connect prometheus:9090',              color: D },
  { delay: 600,  text: '✓ 1,247 metrics — baselines ready.',               color: G },
  { delay: 1200, text: '⚠  checkout_latency_p99 +338% — anomaly',         color: A },
  { delay: 1800, text: '→ root cause: cart OOM, cascading to checkout',    color: D },
  { delay: 2600, text: '→ auto-remediating [risk: LOW]...',                color: D },
  { delay: 3400, text: '✓ resolved in 52s — on-call not paged.',           color: G },
]

function Demo() {
  const [visible, setVisible] = useState<number[]>([])
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    DEMO_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisible(v => [...v, i])
      }, line.delay + 800)
    })
    // hide cursor after last line
    setTimeout(() => setCursor(false), 4400)
  }, [])

  return (
    <div style={{
      border: '1px solid #161616',
      borderRadius: 6,
      background: '#0a0a0a',
      padding: '14px 18px',
      fontSize: 12,
      lineHeight: '1.9',
      letterSpacing: '0.01em',
      minHeight: 140,
    }}>
      {DEMO_LINES.map((line, i) => (
        <div key={i} style={{ color: line.color, opacity: visible.includes(i) ? 1 : 0, transition: 'opacity 0.2s' }}>
          {line.text}
        </div>
      ))}
      {cursor && (
        <span style={{ color: G, animation: 'blink 1s step-end infinite', display: 'inline-block' }}>▊</span>
      )}
    </div>
  )
}

function WaitlistInput() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setTimeout(() => { setLoading(false); setDone(true) }, 400)
  }

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: G }}>
        <span>✓</span>
        <span>you are on the list.</span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', maxWidth: 440 }}>
      <span style={{ color: G, fontSize: 13, marginRight: 10, flexShrink: 0 }}>$</span>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid #222',
          color: W,
          fontFamily: 'inherit',
          fontSize: 13,
          outline: 'none',
          padding: '4px 8px 4px 0',
          letterSpacing: '0.01em',
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
          color: loading ? D : G,
          fontFamily: 'inherit',
          fontSize: 13,
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: '4px 0 4px 16px',
          flexShrink: 0,
          letterSpacing: '0.01em',
        }}
      >
        {loading ? 'joining...' : '[enter]'}
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 28px',
      maxWidth: 620,
      margin: '0 auto',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}>

      {/* nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
        borderBottom: '1px solid #111',
        marginBottom: 0,
      }}>
        <span style={{ color: G, fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>prescient</span>
        <a
          href="https://github.com/munindranath/prescient"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333', fontSize: 12, textDecoration: 'none', letterSpacing: '0.01em' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#666')}
          onMouseLeave={e => (e.currentTarget.style.color = '#333')}
        >
          github ↗
        </a>
      </nav>

      {/* hero — visible above the fold */}
      <section style={{ paddingTop: 72, paddingBottom: 56 }}>

        <p style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28 }}>
          early access
        </p>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 46px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: W,
          marginBottom: 16,
        }}>
          knows before<br />
          <span style={{ color: G }}>you ask.</span>
        </h1>

        <p style={{ fontSize: 13, color: '#3a3a3a', lineHeight: 1.8, marginBottom: 48, maxWidth: 380 }}>
          AI SRE agent. Detects anomalies, generates insights,<br />
          and remediates — before your on-call gets paged.
        </p>

        {/* waitlist — ABOVE the fold */}
        <WaitlistInput />
        <p style={{ fontSize: 11, color: '#1e1e1e', marginTop: 12, letterSpacing: '0.01em' }}>
          no spam · unsubscribe anytime
        </p>

      </section>

      {/* divider */}
      <div style={{ borderTop: '1px solid #111', marginBottom: 40 }} />

      {/* terminal demo — below the fold, but visible on most screens */}
      <section style={{ paddingBottom: 80 }}>
        <p style={{ fontSize: 11, color: '#2a2a2a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          live demo
        </p>
        <Demo />
      </section>

      {/* footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '20px 0',
        borderTop: '1px solid #0e0e0e',
      }}>
        <span style={{ fontSize: 11, color: '#1e1e1e' }}>© 2026 prescient · open-source · MIT</span>
      </footer>

    </main>
  )
}
