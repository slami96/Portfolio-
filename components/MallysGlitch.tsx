'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Screenshots ───────────────────────────────────────────────────────────
// Full-page captures. For sharp full-screen results, replace with real static
// screenshots in /public/mallys/ (e.g. '/mallys/before.png', '/mallys/after.png').
const BEFORE_URL = 'https://image.thum.io/get/width/1600/fullpage/https://www.mallys.cz'
const AFTER_URL  = 'https://image.thum.io/get/width/1600/fullpage/https://mallysremake-b4yb.vercel.app'
const LIVE_URL   = 'https://mallysremake-b4yb.vercel.app'

export default function MallysGlitch() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const beforeRef   = useRef<HTMLDivElement>(null)
  const afterImgRef = useRef<HTMLImageElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const afterTagRef = useRef<HTMLSpanElement>(null)
  const beforeTagRef = useRef<HTMLSpanElement>(null)

  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isDesktop || !sectionRef.current) return

    const SCROLL_DIST = window.innerHeight * 4

    // How far to pan the redesign so its bottom reaches the bottom of the screen.
    const panDist = () => {
      const img = afterImgRef.current, frame = sectionRef.current
      if (!img || !frame) return 0
      return Math.max(0, img.offsetHeight - frame.offsetHeight)
    }

    const ctx = gsap.context(() => {
      // split title into characters for the slam
      const title = titleRef.current!
      title.innerHTML = title.textContent!.trim().split('').map(c =>
        `<span style="display:inline-block;overflow:hidden"><span class="mch" style="display:inline-block">${c}</span></span>`
      ).join('')

      const tl = gsap.timeline()

      tl
        // 1 — title slam in over the (dimmed) Before
        .from(title.querySelectorAll('.mch'), { yPercent: 120, opacity: 0, stagger: 0.05, duration: 1, ease: 'power4.out' }, 0)
        .to(titleWrapRef.current, { duration: 1 }, 1)          // hold
        .to(titleWrapRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 2)
        // 2 — wipe Before away, revealing the redesign full-bleed
        .to(beforeRef.current, { clipPath: 'inset(0 0 0 100%)', duration: 1.6, ease: 'power2.inOut' }, 2.2)
        .to(beforeTagRef.current, { opacity: 0, duration: 0.4 }, 2.2)
        .fromTo(afterTagRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 3.4)
        // 3 — pan the full redesign top -> bottom (clean vertical move, no zoom)
        .to(afterImgRef.current, { y: () => -panDist(), duration: 7, ease: 'none' }, 3.9)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${SCROLL_DIST}`,
        pin: true, pinSpacing: true, anticipatePin: 1,
        scrub: 1, invalidateOnRefresh: true,
        refreshPriority: 1,
        animation: tl,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  const tag: React.CSSProperties = {
    position: 'absolute', bottom: '28px', fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
    padding: '8px 16px', borderRadius: '6px', backdropFilter: 'blur(6px)', zIndex: 6,
  }

  // ── MOBILE: simple, clear, scrollable (no pin) ──
  if (!isDesktop) {
    return (
      <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', padding: '72px 6vw 80px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px,15vw,80px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--white)', lineHeight: 1, margin: '12px 0 36px' }}>Mallys Redesign</h2>

        {[['Before', BEFORE_URL, 0.35], ['After', AFTER_URL, 0]].map(([label, url, gray]) => (
          <div key={label as string} style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: label === 'After' ? 'var(--gold)' : 'var(--muted)', display: 'block', marginBottom: '10px' }}>{label as string}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url as string} alt={`Mallys ${label}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '0.5px solid var(--border)', filter: `grayscale(${gray})` }} />
          </div>
        ))}

        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--cream)', textDecoration: 'none', letterSpacing: '0.08em', borderBottom: '0.5px solid rgba(232,213,183,0.3)', paddingBottom: '3px' }}>View live redesign →</a>

        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
          {[['The problem', 'The original mallys.cz lacked a clear brand voice, poor mobile experience and a generic template feel that did not reflect the handmade craft quality.'], ['The solution', 'Full redesign in Next.js 15 — cinematic hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer built from scratch.']].map(([l, t]) => (
            <div key={l} style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>{l}</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{t}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── DESKTOP: full-screen pinned reveal ──
  return (
    <>
      <section ref={sectionRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#000', borderTop: '0.5px solid var(--border)' }}>
        {/* AFTER layer (beneath) — the redesign that pans */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={afterImgRef}
            src={AFTER_URL}
            alt="Mallys redesign — full page"
            onLoad={() => ScrollTrigger.refresh()}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', display: 'block', willChange: 'transform' }}
          />
        </div>

        {/* BEFORE layer (on top) — gets wiped away to reveal the redesign */}
        <div ref={beforeRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', clipPath: 'inset(0 0 0 0)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BEFORE_URL} alt="Mallys original site" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', display: 'block', filter: 'grayscale(0.4) brightness(0.92)' }} />
          <span ref={beforeTagRef} style={{ ...tag, left: '32px', background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.85)' }}>Before · mallys.cz</span>
        </div>

        {/* AFTER tag (revealed after the wipe) */}
        <span ref={afterTagRef} style={{ ...tag, right: '32px', background: 'rgba(200,169,110,0.18)', border: '0.5px solid rgba(200,169,110,0.45)', color: 'var(--gold)', opacity: 0 }}>After · Redesign</span>

        {/* TITLE overlay */}
        <div ref={titleWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,8,8,0.55)' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Case Study — UX Redesign</span>
          <h2 ref={titleRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(70px,15vw,260px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.9 }}>MALLYS</h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.5rem' }}>Scroll to reveal ↓</span>
        </div>

        {/* live link */}
        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: '28px', right: '32px', zIndex: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--white)', textDecoration: 'none', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.5)', padding: '8px 14px', borderRadius: '6px', backdropFilter: 'blur(6px)' }}>View live →</a>
      </section>

      {/* Problem / solution — normal flow below the pinned reveal */}
      <section style={{ background: 'var(--bg2)', padding: '90px 7vw', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          {[['The problem', 'The original mallys.cz lacked a clear brand voice, poor mobile experience, no product storytelling and a generic template feel that did not reflect the handmade craft quality.'], ['The solution', 'Full redesign in Next.js 15 — cinematic Ken Burns hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer system built from scratch.']].map(([label, text]) => (
            <div key={label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>{label}</div>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
