'use client'
import { useState, useEffect } from 'react'

// Contrast-checked palette (all on #0d0d0d background)
// #00ff87 = 11.5:1 ✓
// #ffb800 = 8.2:1  ✓
// #c8c8c8 = 9.8:1  ✓ (body text)
// #888888 = 5.1:1  ✓ (secondary text — WCAG AA large)
// #555555 = 2.8:1  ✗ — NOT used for text

const G = '#00ff87'   // green  — 11.5:1
const A = '#ffb800'   // amber  — 8.2:1
const S = '#888888'   // secondary — 5.1:1
const W = '#c8c8c8'   // body text — 9.8:1
const HW = '#ffffff'  // headings — 21:1

const DEMO_LINES = [
  { delay: 0,    text: '$ prescient connect prometheus:9090',           color: S },
  { delay: 600,  text: '✓ 1,247 metrics — baselines ready.',            color: G },
  { delay: 1200, text: '⚠  checkout_latency_p99 +338% — anomaly',      color: A },
  { delay: 1900, text: '→ root cause: cart OOM, cascading to checkout', color: W },
  { delay: 2700, text: '→ auto-remediating [risk: LOW]...',             color: S },
  { delay: 3500, text: '✓ resolved in 52s — on-call not paged.',        color: G },
]

function Demo() {
  const [visible, setVisible] = useState<number[]>([])
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    DEMO_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(v => [...v, i]), line.delay + 600)
    })
    setTimeout(() => setShowCursor(false), 4800)
  }, [])

  return (
    <div style={{ border: '1px solid #1e1e1e', borderRadius: 6, background: '#111', padding: '16px 20px', fontSize: 13, lineHeight: '2', letterSpacing: '0.01em', minHeight: 152 }}>
      {DEMO_LINES.map((line, i) => (
        <div key={i} style={{ color: line.color, opacity: visible.includes(i) ? 1 : 0, transition: 'opacity 0.25s' }}>
          {line.text}
        </div>
      ))}
      {showCursor && <span style={{ color: G, animation: 'blink 1s step-end infinite', display: 'inline-block' }}>▊</span>}
    </div>
  )
}

function WaitlistInput() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    } catch {}
    setTimeout(() => { setLoading(false); setDone(true) }, 400)
  }

  if (done) return <p style={{ fontSize: 14, color: G, letterSpacing: '0.01em' }}>✓ you are on the list.</p>

  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 440 }}>
      <span style={{ color: G, fontSize: 14, marginRight: 10, flexShrink: 0, userSelect: 'none' }}>$</span>
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
          borderBottom: '1px solid #333',
          color: HW,
          fontFamily: 'inherit',
          fontSize: 14,
          outline: 'none',
          padding: '6px 8px 6px 0',
          letterSpacing: '0.01em',
        }}
        onFocus={e => { e.target.style.borderBottomColor = G }}
        onBlur={e => { e.target.style.borderBottomColor = '#333' }}
      />
      <button type="submit" disabled={loading} style={{ background: 'none', border: 'none', color: loading ? S : G, fontFamily: 'inherit', fontSize: 14, cursor: loading ? 'default' : 'pointer', padding: '6px 0 6px 16px', flexShrink: 0 }}>
        {loading ? 'joining...' : '[enter]'}
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 28px', maxWidth: 620, margin: '0 auto' }}>

      {/* nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #1a1a1a' }}>
        <span style={{ color: G, fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>prescient</span>
        <a href="https://github.com/munindranath/prescient" target="_blank" rel="noopener noreferrer"
          style={{ color: S, fontSize: 13, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = W)}
          onMouseLeave={e => (e.currentTarget.style.color = S)}>
          github ↗
        </a>
      </nav>

      {/* hero */}
      <section style={{ paddingTop: 64, paddingBottom: 52 }}>
        <p style={{ fontSize: 11, color: S, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28 }}>
          early access
        </p>

        <h1 style={{ fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.15, color: HW, marginBottom: 18 }}>
          knows before<br />
          <span style={{ color: G }}>you ask.</span>
        </h1>

        <p style={{ fontSize: 14, color: W, lineHeight: 1.8, marginBottom: 44, maxWidth: 400 }}>
          AI SRE agent. Detects anomalies, generates insights, and remediates — before your on-call gets paged.
        </p>

        <WaitlistInput />

        <p style={{ fontSize: 12, color: S, marginTop: 14 }}>
          no spam · unsubscribe anytime
        </p>
      </section>

      {/* divider */}
      <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: 36 }} />

      {/* demo */}
      <section style={{ paddingBottom: 80 }}>
        <p style={{ fontSize: 11, color: S, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
          live demo
        </p>
        <Demo />
      </section>

      <footer style={{ marginTop: 'auto', padding: '20px 0', borderTop: '1px solid #1a1a1a' }}>
        <span style={{ fontSize: 12, color: S }}>© 2026 prescient · open-source · MIT</span>
      </footer>

    </main>
  )
}
