'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Static, self-hosted screenshots — they live in /public.
const BEFORE_URL   = '/mallys-before.jpg'
const BEFORE_URL_2 = '/mallys-before-2.jpg'
const AFTER_URL    = '/mallys-after.jpg'
const AFTER_URL_2  = '/mallys-after-2.jpg'
const LIVE_URL     = 'https://mallysremake-b4yb.vercel.app'

export default function MallysGlitch() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const l1Ref = useRef<HTMLDivElement>(null)   // before 1
  const l2Ref = useRef<HTMLDivElement>(null)   // before 2
  const l3Ref = useRef<HTMLDivElement>(null)   // after 1
  const l4Ref = useRef<HTMLDivElement>(null)   // after 2
  const beforePillRef = useRef<HTMLSpanElement>(null)
  const afterPillRef  = useRef<HTMLSpanElement>(null)
  // Editorial MacBook
  const editorialRef = useRef<HTMLDivElement>(null)
  const editLidRef   = useRef<HTMLDivElement>(null)
  const editTextRef  = useRef<HTMLDivElement>(null)

  const [isDesktop, setIsDesktop] = useState(true)

  // MacBook screen cross-fade (after ↔ after-2) every 1.5s
  const [afterSlot, setAfterSlot] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setAfterSlot(p => (p === 0 ? 1 : 0)), 2000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isDesktop || !sectionRef.current) return

    const SCROLL_DIST = window.innerHeight * 6

    const ctx = gsap.context(() => {
      // split the title for the slam-in
      const title = titleRef.current!
      title.innerHTML = title.textContent!.trim().split('').map(c =>
        `<span style="display:inline-block;overflow:hidden"><span class="mch" style="display:inline-block">${c}</span></span>`
      ).join('')

      const l1 = l1Ref.current!, l2 = l2Ref.current!, l3 = l3Ref.current!, l4 = l4Ref.current!

      // base: all hidden; l1 slides in from the right, others cross-fade in place
      gsap.set([l2, l3, l4], { opacity: 0 })

      const tl = gsap.timeline()
      tl
        // 1 — MALLYS slams in, holds, clears
        .from(title.querySelectorAll('.mch'), { yPercent: 120, opacity: 0, stagger: 0.05, duration: 1, ease: 'power4.out' }, 0)
        .to(titleWrapRef.current, { duration: 1 }, 1)
        .to(titleWrapRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 2)
        // 2 — BEFORE 1 slides in from the right (the old site)
        .fromTo(l1, { x: () => window.innerWidth * 0.6, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3, ease: 'power3.out' }, 2.4)
        .fromTo(beforePillRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 3.3)
        .to({}, { duration: 1 }, 3.8)                                  // hold on before 1
        // 3 — BEFORE 2 cross-fades in (still the old site)
        .to(l1, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 4.8)
        .fromTo(l2, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 4.8)
        .to({}, { duration: 1 }, 5.6)                                  // hold on before 2
        // 4 — AFTER 1 cross-fades in (the redesign) — pill swaps to "After"
        .to(l2, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 6.6)
        .to(beforePillRef.current, { opacity: 0, duration: 0.4 }, 6.6)
        .fromTo(l3, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 6.6)
        .fromTo(afterPillRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 7.0)
        .to({}, { duration: 1 }, 7.6)                                  // hold on after 1
        // 5 — AFTER 2 cross-fades in (more of the redesign)
        .to(l3, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 8.6)
        .fromTo(l4, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 8.6)
        .to({}, { duration: 1.2 }, 9.4)                                // hold on after 2

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${SCROLL_DIST}`,
        pin: true, pinSpacing: true, anticipatePin: 1,
        scrub: 1, invalidateOnRefresh: true, refreshPriority: 1,
        animation: tl,
      })

      // ── EDITORIAL: MacBook opens as you scroll into the section ──
      if (editLidRef.current && editorialRef.current) {
        gsap.fromTo(editLidRef.current,
          { rotateX: -90 },
          { rotateX: 0, ease: 'none',
            scrollTrigger: { trigger: editorialRef.current, start: 'top 80%', end: 'top 30%', scrub: true } })
      }
      if (editTextRef.current && editorialRef.current) {
        gsap.from(editTextRef.current.children,
          { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: editorialRef.current, start: 'top 70%' } })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  // Brand-chip label
  const pillBase: React.CSSProperties = {
    position: 'absolute', top: '-34px', left: '0', zIndex: 5,
    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    padding: '7px 14px', borderRadius: '100px', whiteSpace: 'nowrap',
  }

  const layerStyle: React.CSSProperties = { position: 'absolute', inset: 0, willChange: 'transform, opacity' }
  const imgStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain', display: 'block' }
  const screenImg: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', transition: 'opacity 0.7s ease' }

  const copy: [string, string][] = [
    ['The problem', 'The original mallys.cz lacked a clear brand voice, had a poor mobile experience and no product storytelling — a generic template that didn’t reflect the handmade craft.'],
    ['The solution', 'Full redesign in Next.js 15 — a cinematic Ken Burns hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer built from scratch.'],
    ['My role', 'UX/UI design, brand direction and the full front-end build, delivered during my internship at Mallys.'],
  ]

  // ── MOBILE: stacked before 1/2 → after 1/2, no pin ──
  if (!isDesktop) {
    const shots: [string, string, number][] = [
      ['Before · 01', BEFORE_URL, 0.4],
      ['Before · 02', BEFORE_URL_2, 0.4],
      ['After · 01', AFTER_URL, 0],
      ['After · 02', AFTER_URL_2, 0],
    ]
    return (
      <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', padding: '72px 6vw 80px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px,15vw,80px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--white)', lineHeight: 1, margin: '12px 0 36px' }}>Mallys Redesign</h2>

        {shots.map(([label, url, gray]) => (
          <div key={label} style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: label.startsWith('After') ? 'var(--gold)' : 'var(--muted)', display: 'block', marginBottom: '10px' }}>{label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Mallys ${label}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '0.5px solid var(--border)', filter: `grayscale(${gray})`, display: 'block' }} />
          </div>
        ))}

        <div style={{ marginTop: '8px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
          {copy.map(([l, t]) => (
            <div key={l} style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{l}</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{t}</p>
            </div>
          ))}
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0b0b0b', background: 'var(--cream)', padding: '15px 30px', borderRadius: '100px', textDecoration: 'none', fontWeight: 700 }}>View live redesign ↗</a>
        </div>
      </section>
    )
  }

  // ── DESKTOP: pinned film (before 1/2 → after 1/2) + editorial MacBook ──
  return (
    <>
      <section ref={sectionRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#000', borderTop: '0.5px solid var(--border)' }}>
        {/* eyebrow, top-left */}
        <div style={{ position: 'absolute', top: '36px', left: '7vw', zIndex: 3 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        </div>

        {/* STAGE — 4 stacked image layers, all contained (full image) */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '74vw', height: '82vh', zIndex: 2 }}>
          <span ref={beforePillRef} style={{ ...pillBase, background: 'rgba(8,8,8,0.72)', color: 'rgba(255,255,255,0.92)', border: '0.5px solid rgba(255,255,255,0.25)', opacity: 0 }}>Before · mallys.cz</span>
          <span ref={afterPillRef}  style={{ ...pillBase, background: 'var(--cream)', color: '#0b0b0b', fontWeight: 700, opacity: 0 }}>After · Redesign</span>

          <div ref={l1Ref} style={layerStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BEFORE_URL} alt="Mallys original site — 1" onLoad={() => ScrollTrigger.refresh()} style={imgStyle} />
          </div>
          <div ref={l2Ref} style={layerStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BEFORE_URL_2} alt="Mallys original site — 2" style={imgStyle} />
          </div>
          <div ref={l3Ref} style={layerStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AFTER_URL} alt="Mallys redesign — 1" style={imgStyle} />
          </div>
          <div ref={l4Ref} style={layerStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AFTER_URL_2} alt="Mallys redesign — 2" style={imgStyle} />
          </div>
        </div>

        {/* TITLE overlay */}
        <div ref={titleWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', background: '#000' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.4rem' }}>Case Study — UX Redesign</span>
          <h2 ref={titleRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(70px,15vw,240px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.9 }}>MALLYS</h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.4rem' }}>Scroll to reveal the redesign ↓</span>
        </div>
      </section>

      {/* Editorial — MacBook opens on scroll (left), text reveals (right) */}
      <section ref={editorialRef} style={{ background: 'var(--bg2)', padding: '100px 7vw', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>

          {/* MacBook (left) */}
          <div style={{ perspective: '2200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div ref={editLidRef} style={{
              width: '100%', maxWidth: 560, aspectRatio: '16 / 10',
              transformOrigin: 'center bottom', transform: 'rotateX(-90deg)',
              background: '#0a0a0a', borderRadius: '14px 14px 5px 5px',
              padding: '9px 9px 10px', boxSizing: 'border-box',
              boxShadow: '0 45px 80px rgba(0,0,0,0.5)', position: 'relative', willChange: 'transform',
            }}>
              <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 84, height: 5, background: '#000', borderRadius: 4, zIndex: 2 }} />
              <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden', background: '#0d0d10' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={AFTER_URL} alt="Mallys redesign — 1" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} style={{ ...screenImg, opacity: afterSlot === 0 ? 1 : 0 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={AFTER_URL_2} alt="Mallys redesign — 2" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} style={{ ...screenImg, opacity: afterSlot === 1 ? 1 : 0 }} />
              </div>
            </div>
            <div style={{
              width: 'min(108%, 600px)', height: '13px', marginTop: '-1px',
              background: 'linear-gradient(180deg,#43434a 0%, #232327 55%, #0c0c0e 100%)',
              borderRadius: '4px 4px 12px 12px', boxShadow: '0 30px 50px rgba(0,0,0,0.55)', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '116px', height: '5px', background: '#0a0a0a', borderRadius: '0 0 6px 6px' }} />
            </div>
          </div>

          {/* Text (right) */}
          <div ref={editTextRef}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block' }}>Mallys · Handmade Porcelain</span>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--white)', margin: '14px 0 28px', lineHeight: 1.1 }}>From generic template<br />to a brand with a voice.</h3>
            {copy.map(([l, t]) => (
              <div key={l} style={{ marginBottom: '22px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{l}</div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{t}</p>
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '6px 0 30px' }}>
              {['Next.js 15', 'GSAP', 'UX/UI', 'Branding', 'i18n CZ/EN'].map(tg => (
                <span key={tg} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', padding: '4px 11px', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '100px', color: 'rgba(255,255,255,0.4)' }}>{tg}</span>
              ))}
            </div>
            <a href={LIVE_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0b0b0b', background: 'var(--cream)', padding: '17px 34px', borderRadius: '100px', textDecoration: 'none', fontWeight: 700, transition: 'transform 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              View live redesign ↗
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
