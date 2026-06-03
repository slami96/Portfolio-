'use client'
import { useEffect, useRef, useState } from 'react'

// ── Screenshots ───────────────────────────────────────────────────────────
// These use a live full-page screenshot service. It works, but it can be slow
// and occasionally rate-limited. For best speed + reliability, take two real
// full-page screenshots, drop them in /public/mallys/, and swap the URLs below:
//   const BEFORE_URL = '/mallys/before.png'
//   const AFTER_URL  = '/mallys/after.png'
const BEFORE_URL = 'https://image.thum.io/get/width/1200/fullpage/https://www.mallys.cz'
const AFTER_URL  = 'https://image.thum.io/get/width/1200/fullpage/https://mallysremake-b4yb.vercel.app'
const LIVE_URL   = 'https://mallysremake-b4yb.vercel.app'

export default function MallysGlitch() {
  const [view, setView] = useState<'before' | 'after'>('after')
  const frameRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  // Gentle fade-up when the section scrolls into view
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const host = view === 'after' ? 'mallysremake-b4yb.vercel.app' : 'mallys.cz'

  const tabBase: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '8px 18px', borderRadius: '100px', cursor: 'pointer',
    border: '0.5px solid var(--border)', background: 'transparent',
    transition: 'all 0.3s ease',
  }
  const tabActive: React.CSSProperties = {
    ...tabBase, background: 'var(--gold)', color: '#0b0b0b',
    borderColor: 'var(--gold)', fontWeight: 700,
  }
  const tabIdle: React.CSSProperties = { ...tabBase, color: 'var(--muted)' }

  const layers: { key: 'before' | 'after'; url: string }[] = [
    { key: 'before', url: BEFORE_URL },
    { key: 'after',  url: AFTER_URL },
  ]

  return (
    <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', padding: '100px 7vw 90px' }}>
      <style>{`
        @keyframes mallyScroll {
          from { background-position: center top; }
          to   { background-position: center bottom; }
        }
        .mally-page { animation: mallyScroll 26s ease-in-out infinite alternate; }
        .mally-frame:hover .mally-page { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .mally-page { animation: none; background-position: center top; }
        }
      `}</style>

      {/* Header */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
        Case Study — UX Redesign
      </span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '2rem' }}>
        Mallys · Before<br />&amp; After
      </h2>

      {/* Before / After toggle */}
      <div role="tablist" aria-label="Compare designs" style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button role="tab" aria-selected={view === 'before'} onClick={() => setView('before')} style={view === 'before' ? tabActive : tabIdle}>
          Before
        </button>
        <button role="tab" aria-selected={view === 'after'} onClick={() => setView('after')} style={view === 'after' ? tabActive : tabIdle}>
          After
        </button>
      </div>

      {/* Browser frame */}
      <div
        ref={frameRef}
        className="mally-frame"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          borderRadius: '12px', overflow: 'hidden',
          border: '0.5px solid var(--border)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)', background: '#000',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: '#111', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '7px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ flex: 1, maxWidth: 420, margin: '0 auto', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--muted)', background: '#0b0b0b', border: '0.5px solid var(--border)', borderRadius: '100px', padding: '5px 14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {host}
          </div>
          <span style={{ width: 47, flexShrink: 0 }} aria-hidden /> {/* balances the dots */}
        </div>

        {/* Viewport — full page scrolls through here */}
        <div style={{ position: 'relative', width: '100%', height: 'clamp(380px, 64vh, 700px)', overflow: 'hidden', background: '#fff' }}>
          {layers.map(({ key, url }) => (
            <div
              key={key}
              className="mally-page"
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url("${url}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% auto',
                opacity: view === key ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Hint + live link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
          ↕ Scrolling the full page · hover to pause
        </span>
        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--cream)', textDecoration: 'none', letterSpacing: '0.08em', borderBottom: '0.5px solid rgba(232,213,183,0.3)', paddingBottom: '2px' }}>
          View live redesign →
        </a>
      </div>

      {/* Captions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '48px 0 0', gap: '40px', borderTop: '0.5px solid var(--border)', marginTop: '48px' }}>
        {[
          ['The problem', 'The original mallys.cz lacked a clear brand voice, poor mobile experience, no product storytelling and a generic template feel that did not reflect the handmade craft quality.'],
          ['The solution', 'Full redesign in Next.js 15 — cinematic Ken Burns hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer system built from scratch.'],
        ].map(([label, text]) => (
          <div key={label}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>{label}</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
