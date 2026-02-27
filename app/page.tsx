'use client'
import { useState, useEffect, useRef } from 'react'

const TERMINAL_LINES = [
  { delay: 0,    text: '$ prescient connect --source prometheus:9090', color: 'text-gray-400' },
  { delay: 600,  text: '✓ Connected to Prometheus (1,247 metrics)', color: 'text-[#00ff87]' },
  { delay: 1200, text: '✓ Baseline established (EMA α=0.05, 3σ threshold)', color: 'text-[#00ff87]' },
  { delay: 1800, text: '⚠ Anomaly detected: checkout_latency_p99 +340%', color: 'text-[#ffb800]' },
  { delay: 2400, text: '→ Investigating: 3 similar incidents in memory...', color: 'text-gray-400' },
  { delay: 3000, text: '→ Root cause: cart-service OOM, cascading to checkout', color: 'text-gray-300' },
  { delay: 3600, text: '→ Suggested fix: kubectl rollout restart deploy/cart', color: 'text-gray-300' },
  { delay: 4200, text: '→ Risk: LOW — auto-executing in 5s (undo: ctrl+z)', color: 'text-[#00ff87]' },
  { delay: 4800, text: '✓ Remediated. Latency returning to baseline.', color: 'text-[#00ff87]' },
  { delay: 5400, text: '  Time to resolve: 47s  |  On-call not paged.', color: 'text-gray-500' },
]

const STATS = [
  { value: '47s', label: 'avg time to resolve' },
  { value: '13', label: 'connectors (Prometheus, Datadog, Loki…)' },
  { value: '4-tier', label: 'LLM routing (local → Claude)' },
  { value: '100%', label: 'high-risk actions require approval' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect your stack',
    desc: 'Plug into Prometheus, Grafana, Loki, Datadog, or any of 13 connectors. No data leaves your infra unless you want it to.',
  },
  {
    step: '02',
    title: 'Baselines, automatically',
    desc: 'Adaptive EMA baselines calibrate to your traffic patterns. No manual threshold tuning. No alert storms.',
  },
  {
    step: '03',
    title: 'Insight, not noise',
    desc: 'When something breaks, Prescient investigates — correlating signals, searching incident memory, generating a root cause hypothesis.',
  },
  {
    step: '04',
    title: 'Fixes, risk-gated',
    desc: 'Low-risk remediations execute automatically. Medium gets a Slack notification with a 60s undo window. High or critical always require your approval.',
  },
]

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        if (i === TERMINAL_LINES.length - 1) setTimeout(() => setDone(true), 800)
      }, line.delay + 400)
    })
  }, [])

  return (
    <div className="terminal-border rounded-lg overflow-hidden bg-[#0d0d0d] shadow-2xl w-full max-w-2xl mx-auto">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e1e] bg-[#111]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 text-xs text-[#444] tracking-wider">prescient — production</span>
      </div>
      {/* body */}
      <div className="p-5 space-y-1 min-h-[280px] font-mono text-sm leading-relaxed">
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'} ${line.color}`}
          >
            {line.text}
          </div>
        ))}
        {done && (
          <div className="text-[#00ff87] opacity-100">
            <span className="text-[#444]">$ </span>
            <span className="inline-block w-2 h-4 bg-[#00ff87] animate-pulse align-middle" />
          </div>
        )}
      </div>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // POST to /api/waitlist
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-[#00ff87] font-mono text-sm slide-up">
        <span className="text-lg">✓</span>
        <span>You&apos;re on the list. We&apos;ll reach out before launch.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="flex-1 bg-[#111] border border-[#1e1e1e] rounded px-4 py-3 text-sm font-mono text-gray-200 placeholder-[#444] focus:outline-none focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-[#00ff87] text-black font-mono font-semibold text-sm rounded hover:bg-[#00e87a] transition-all glow-green-hover disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? 'joining...' : 'join waitlist →'}
      </button>
    </form>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] grid-bg relative overflow-hidden">
      {/* noise overlay */}
      <div className="fixed inset-0 noise-overlay opacity-30 pointer-events-none z-0" />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a] max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff87] font-mono font-semibold text-lg tracking-tight">prescient</span>
          <span className="text-[#333] font-mono text-xs mt-0.5">/ beta</span>
        </div>
        <a
          href="https://github.com/munindranath/prescient"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-[#555] hover:text-[#00ff87] transition-colors border border-[#222] px-3 py-1.5 rounded hover:border-[#00ff87]"
        >
          ★ github
        </a>
      </nav>

      {/* hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        <div className="slide-up inline-flex items-center gap-2 text-xs font-mono text-[#00ff87] border border-[#00ff8733] bg-[#00ff870a] px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
          early access open
        </div>

        <h1 className="slide-up-delay text-5xl sm:text-6xl md:text-7xl font-mono font-semibold tracking-tight text-white leading-[1.05] mb-6">
          Knows before<br />
          <span className="text-[#00ff87]">you ask.</span>
        </h1>

        <p className="slide-up-delay-2 text-[#666] font-mono text-base sm:text-lg max-w-xl leading-relaxed mb-10">
          AI SRE agent that detects anomalies, generates insights,
          and remediates incidents — before your on-call gets paged.
        </p>

        <div className="slide-up-delay-3 mb-16">
          <WaitlistForm />
          <p className="text-[#333] text-xs font-mono mt-3">No spam. Early access only. Unsubscribe anytime.</p>
        </div>

        <div className="w-full slide-up-delay-3">
          <TerminalWindow />
        </div>
      </section>

      {/* stats bar */}
      <section className="relative z-10 border-y border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[#00ff87] font-mono font-semibold text-2xl mb-1">{s.value}</div>
              <div className="text-[#444] font-mono text-xs leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-[#00ff87] font-mono text-xs tracking-widest uppercase">how it works</span>
          <h2 className="text-3xl font-mono font-semibold text-white mt-3">From signal to fix in seconds.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={i} className="border border-[#1a1a1a] bg-[#0d0d0d] rounded-lg p-6 hover:border-[#00ff8733] transition-colors group">
              <div className="text-[#00ff87] font-mono text-xs mb-3 opacity-60 group-hover:opacity-100 transition-opacity">{item.step}</div>
              <h3 className="font-mono font-semibold text-white text-base mb-2">{item.title}</h3>
              <p className="font-mono text-[#555] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* connectors */}
      <section className="relative z-10 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-[#333] font-mono text-xs tracking-widest uppercase mb-6">connects to your existing stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Prometheus', 'Grafana', 'Loki', 'Tempo', 'Datadog', 'SigNoz', 'ClickHouse', 'Elasticsearch', 'Jaeger', 'PagerDuty', 'Slack', 'K8s', 'SSH'].map(tool => (
              <span key={tool} className="font-mono text-xs text-[#444] border border-[#1e1e1e] px-3 py-1.5 rounded hover:text-[#666] hover:border-[#2a2a2a] transition-colors">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* safety callout */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="border border-[#1a1a1a] border-l-2 border-l-[#00ff87] bg-[#0d0d0d] rounded-lg p-8">
          <div className="font-mono text-xs text-[#00ff87] mb-3 tracking-widest uppercase">safety invariant</div>
          <code className="font-mono text-base text-white block mb-3">
            risk: high | critical → requiresApproval: true
          </code>
          <p className="font-mono text-[#555] text-sm leading-relaxed max-w-xl">
            Hard-coded. Tested. Non-negotiable. Prescient never autonomously executes high-risk actions.
            Always in code, always in tests, always enforced at runtime.
          </p>
        </div>
      </section>

      {/* bottom CTA */}
      <section className="relative z-10 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-mono font-semibold text-white mb-4">
            Stop reacting.<br />
            <span className="text-[#00ff87]">Start knowing.</span>
          </h2>
          <p className="font-mono text-[#555] text-sm mb-10 max-w-sm mx-auto">
            Join the waitlist. Get early access when we launch.
          </p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-[#1a1a1a] px-6 py-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-[#333]">© 2026 Prescient. Open-source. MIT license.</span>
        <div className="flex items-center gap-6 font-mono text-xs text-[#333]">
          <a href="https://github.com/munindranath/prescient" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff87] transition-colors">github</a>
          <a href="mailto:hello@tryprescient.io" className="hover:text-[#00ff87] transition-colors">contact</a>
        </div>
      </footer>
    </main>
  )
}
