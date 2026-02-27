'use client'
import { useState, useEffect } from 'react'

const LINES = [
  { t: 0,    text: '$ prescient connect prometheus:9090',     color: '#555' },
  { t: 700,  text: '✓ 1,247 metrics. Baselines ready.',       color: '#00ff87' },
  { t: 1400, text: '⚠ checkout_latency_p99 +340% — anomaly', color: '#ffb800' },
  { t: 2100, text: '→ root cause: cart OOM, cascading',       color: '#888' },
  { t: 2800, text: '→ fix: kubectl rollout restart cart',     color: '#888' },
  { t: 3500, text: '✓ resolved in 47s. on-call not paged.',   color: '#00ff87' },
]

function Terminal() {
  const [visible, setVisible] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisible(v => [...v, i])
        if (i === LINES.length - 1) setTimeout(() => setDone(true), 600)
      }, line.t + 300)
    })
  }, [])

  return (
    <div style={{ border: '1px solid #1a1a1a', borderRadius: 8, overflow: 'hidden', background: '#0c0c0c', width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid #141414' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#222' }} />
      </div>
      <div style={{ padding: '16px 18px', minHeight: 160, fontSize: 12, lineHeight: '1.9', letterSpacing: '0.01em' }}>
        {LINES.map((line, i) => (
          <div key={i} style={{ color: line.color, opacity: visible.includes(i) ? 1 : 0, transition: 'opacity 0.3s' }}>
            {line.text}
          </div>
        ))}
        {done && <div style={{ marginTop: 4 }}><span className="cursor" /></div>}
      </div>
    </div>
  )
}

function Form() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try { await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }) } catch {}
    setTimeout(() => { setLoading(false); setDone(true) }, 500)
  }

  if (done) return <p style={{ fontSize: 13, color: '#00ff87' }}>✓ you are on the list.</p>

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 400 }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        style={{ flex: 1, background: '#0f0f0f', border: '1px solid #222', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#ccc', fontFamily: 'inherit', outline: 'none' }}
        onFocus={e => { e.target.style.borderColor = '#00ff87' }}
        onBlur={e => { e.target.style.borderColor = '#222' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ background: '#00ff87', color: '#000', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontFamily: 'inherit', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap' }}
      >
        {loading ? '...' : 'join waitlist →'}
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid #111' }}>
        <span style={{ color: '#00ff87', fontSize: 15, fontWeight: 500, letterSpacing: '-0.02em' }}>prescient</span>
        <a href="https://github.com/munindranath/prescient" target="_blank" rel="noopener noreferrer" style={{ color: '#333', fontSize: 12, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#666')}
          onMouseLeave={e => (e.currentTarget.style.color = '#333')}>
          github ↗
        </a>
      </nav>

      <div style={{ textAlign: 'center', maxWidth: 520, width: '100%' }}>

        <p className="fade-up-1" style={{ fontSize: 11, color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>
          early access
        </p>

        <h1 className="fade-up-2" style={{ fontSize: 'clamp(38px, 6vw, 58px)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', marginBottom: 20 }}>
          knows before<br /><span style={{ color: '#00ff87' }}>you ask.</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.8, marginBottom: 44, maxWidth: 360, margin: '0 auto 44px' }}>
          AI SRE agent. Detects anomalies, generates insights, and remediates — before your on-call gets paged.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <Form />
          <span style={{ fontSize: 11, color: '#222' }}>no spam · unsubscribe anytime</span>
        </div>

        <div className="fade-up-4" style={{ display: 'flex', justifyContent: 'center' }}>
          <Terminal />
        </div>

      </div>

      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderTop: '1px solid #0e0e0e' }}>
        <span style={{ fontSize: 11, color: '#222' }}>© 2026 Prescient · open-source · MIT</span>
      </footer>

    </main>
  )
}
