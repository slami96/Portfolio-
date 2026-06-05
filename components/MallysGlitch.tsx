'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Static, self-hosted screenshots — no more thum.io. They live in /public.
const BEFORE_URL = '/mallys-before.jpg'
const AFTER_URL  = '/mallys-after.jpg'
const LIVE_URL   = 'https://mallysremake-b4yb.vercel.app'

export default function MallysGlitch() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const afterImgRef   = useRef<HTMLImageElement>(null)
  const beforeWrapRef = useRef<HTMLDivElement>(null)
  const seamRef       = useRef<HTMLDivElement>(null)
  const beforeTagRef  = useRef<HTMLSpanElement>(null)
  const afterTagRef   = useRef<HTMLSpanElement>(null)
  const titleWrapRef  = useRef<HTMLDivElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const dimRef        = useRef<HTMLDivElement>(null)
  const hintRef       = useRef<HTMLDivElement>(null)

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

    // ~3.6 screens of scroll: title beat -> reveal -> the wipe -> hold.
    const SCROLL_DIST = window.innerHeight * 3.6

    const ctx = gsap.context(() => {
      // split the title into characters for the slam-in
      const title = titleRef.current!
      title.innerHTML = title.textContent!.trim().split('').map(c =>
        `<span style="display:inline-block;overflow:hidden"><span class="mch" style="display:inline-block">${c}</span></span>`
      ).join('')

      // seam: v = 0..100, the % of the redesign ("after") revealed from the left.
      // The "before" sits on top and is clipped from its left edge as v grows.
      const seam = { v: 0 }
      const setSeam = (val: number) => {
        if (beforeWrapRef.current) beforeWrapRef.current.style.clipPath = `inset(0 0 0 ${val}%)`
        if (seamRef.current) seamRef.current.style.left = `${val}%`
      }
      setSeam(0)

      const tl = gsap.timeline()
      tl
        // 1 — MALLYS slams in over a dimmed "before"
        .from(title.querySelectorAll('.mch'),
          { yPercent: 120, opacity: 0, stagger: 0.05, duration: 1, ease: 'power4.out' }, 0)
        .to(titleWrapRef.current, { duration: 1 }, 1)                       // hold
        // 2 — title clears, the original site un-dims, BEFORE label appears
        .to(titleWrapRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 2)
        .to(dimRef.current, { opacity: 0, duration: 0.7 }, 2)
        .fromTo(beforeTagRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 2.4)
        .to({}, { duration: 0.4 }, 2.7)                                     // beat to read "before"
        // 3 — the wipe: original peels left -> right to reveal the redesign
        .to(seam, { v: 100, ease: 'none', duration: 3, onUpdate: () => setSeam(seam.v) }, 3.1)
        .fromTo(afterTagRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 4.2)
        .to(beforeTagRef.current, { opacity: 0, duration: 0.5 }, 5.6)
        .to(seamRef.current, { opacity: 0, duration: 0.4 }, 5.9)
        // 4 — hold on the finished redesign + a live nudge
        .fromTo(hintRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 6.1)
        .to({}, { duration: 0.6 }, 6.4)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${SCROLL_DIST}`,
        pin: true, pinSpacing: true, anticipatePin: 1,
        scrub: 1, invalidateOnRefresh: true, refreshPriority: 1,
        animation: tl,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  // shared label style
  const tag: React.CSSProperties = {
    position: 'absolute', top: '28px',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    padding: '8px 14px', borderRadius: '6px', backdropFilter: 'blur(6px)', zIndex: 6,
  }

  const copy: [string, string][] = [
    ['The problem', 'The original mallys.cz lacked a clear brand voice, had a poor mobile experience and no product storytelling — a generic template that didn’t reflect the handmade craft.'],
    ['The solution', 'Full redesign in Next.js 15 — a cinematic Ken Burns hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer built from scratch.'],
    ['My role', 'UX/UI design, brand direction and the full front-end build, delivered during my internship at Mallys.'],
  ]

  // ── MOBILE: clear, scrollable stacked before / after (no pin) ──
  if (!isDesktop) {
    return (
      <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', padding: '72px 6vw 80px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px,15vw,80px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--white)', lineHeight: 1, margin: '12px 0 36px' }}>Mallys Redesign</h2>

        {([['Before', BEFORE_URL, 0.45], ['After', AFTER_URL, 0]] as [string, string, number][]).map(([label, url, gray]) => (
          <div key={label} style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: label === 'After' ? 'var(--gold)' : 'var(--muted)', display: 'block', marginBottom: '10px' }}>{label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Mallys ${label}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '0.5px solid var(--border)', filter: `grayscale(${gray})`, display: 'block' }} />
          </div>
        ))}

        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0b0b0b', background: 'var(--cream)', padding: '13px 24px', borderRadius: '100px', textDecoration: 'none', fontWeight: 700 }}>View live redesign ↗</a>

        <div style={{ marginTop: '44px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
          {copy.map(([l, t]) => (
            <div key={l} style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{l}</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{t}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── DESKTOP: pinned before → after wipe, then editorial ──
  return (
    <>
      <section ref={sectionRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#000', borderTop: '0.5px solid var(--border)' }}>
        {/* AFTER (base layer) — the finished redesign */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={afterImgRef}
          src={AFTER_URL}
          alt="Mallys redesign"
          onLoad={() => ScrollTrigger.refresh()}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
        />

        {/* BEFORE (top layer) — clipped away by the seam */}
        <div ref={beforeWrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: 'inset(0 0 0 0%)', willChange: 'clip-path' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BEFORE_URL} alt="Mallys original site" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', filter: 'grayscale(0.25) brightness(0.95)', display: 'block' }} />
        </div>

        {/* dim overlay (only during the title beat) */}
        <div ref={dimRef} style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.55)', zIndex: 5, pointerEvents: 'none' }} />

        {/* seam line + grip — reads as a before/after handle */}
        <div ref={seamRef} style={{ position: 'absolute', top: 0, bottom: 0, left: '0%', width: '2px', background: 'var(--cream)', boxShadow: '0 0 18px rgba(232,213,183,0.6)', zIndex: 6, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(8,8,8,0.6)', border: '1px solid var(--cream)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '-2px' }}>‹›</div>
        </div>

        {/* labels */}
        <span ref={beforeTagRef} style={{ ...tag, left: '28px', background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', opacity: 0 }}>Before · mallys.cz</span>
        <span ref={afterTagRef} style={{ ...tag, right: '28px', background: 'rgba(200,169,110,0.16)', border: '0.5px solid rgba(200,169,110,0.45)', color: 'var(--gold)', opacity: 0 }}>After · Redesign</span>

        {/* live nudge at the end of the wipe */}
        <div ref={hintRef} style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 7, opacity: 0 }}>
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0b0b0b', background: 'var(--cream)', padding: '12px 24px', borderRadius: '100px', textDecoration: 'none', fontWeight: 700 }}>View live redesign ↗</a>
        </div>

        {/* TITLE overlay */}
        <div ref={titleWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.4rem' }}>Case Study — UX Redesign</span>
          <h2 ref={titleRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(70px,15vw,240px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.9 }}>MALLYS</h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.4rem' }}>Scroll to reveal the redesign ↓</span>
        </div>

        {/* persistent live link */}
        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 9, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--white)', textDecoration: 'none', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.5)', padding: '8px 14px', borderRadius: '6px', backdropFilter: 'blur(6px)' }}>View live ↗</a>
      </section>

      {/* Editorial — normal flow below the pin (Print-section pattern) */}
      <section style={{ background: 'var(--bg2)', padding: '90px 7vw', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '0.5px solid var(--border)', boxShadow: '0 40px 90px rgba(0,0,0,0.4)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AFTER_URL} alt="Mallys redesign — full view" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Mallys · Handmade Porcelain</span>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--white)', margin: '14px 0 28px', lineHeight: 1.1 }}>From generic template<br />to a brand with a voice.</h3>
            {copy.map(([l, t]) => (
              <div key={l} style={{ marginBottom: '22px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{l}</div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{t}</p>
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '6px 0 28px' }}>
              {['Next.js 15', 'GSAP', 'UX/UI', 'Branding', 'i18n CZ/EN'].map(tg => (
                <span key={tg} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', padding: '4px 11px', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '100px', color: 'rgba(255,255,255,0.4)' }}>{tg}</span>
              ))}
            </div>
            <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0b0b0b', background: 'var(--cream)', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none', fontWeight: 700 }}>View live redesign ↗</a>
          </div>
        </div>
      </section>
    </>
  )
}
