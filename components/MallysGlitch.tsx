'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Static, self-hosted screenshots — no thum.io. They live in /public.
const BEFORE_URL = '/mallys-before.jpg'
const AFTER_URL  = '/mallys-after.jpg'
const LIVE_URL   = 'https://mallysremake-b4yb.vercel.app'

export default function MallysGlitch() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const titleWrapRef  = useRef<HTMLDivElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const afterCardRef  = useRef<HTMLDivElement>(null)
  const beforeCardRef = useRef<HTMLDivElement>(null)
  const afterPillRef  = useRef<HTMLSpanElement>(null)
  const beforePillRef = useRef<HTMLSpanElement>(null)

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

    // Generous distance so the film stays deliberate even when scrolled fast.
    const SCROLL_DIST = window.innerHeight * 6
    const vw = () => window.innerWidth

    const ctx = gsap.context(() => {
      // split the title for the slam-in
      const title = titleRef.current!
      title.innerHTML = title.textContent!.trim().split('').map(c =>
        `<span style="display:inline-block;overflow:hidden"><span class="mch" style="display:inline-block">${c}</span></span>`
      ).join('')

      const after = afterCardRef.current!
      const before = beforeCardRef.current!

      // base positions: both centered (left/top 50% via CSS) and shifted by transforms
      gsap.set(after,  { xPercent: -50, yPercent: -50, transformOrigin: 'center center', width: () => vw() * 0.62, x: () => vw() * 0.6, opacity: 0, scale: 0.92 })
      gsap.set(before, { xPercent: -50, yPercent: -50, transformOrigin: 'center center', width: () => vw() * 0.42, x: () => -vw() * 0.6, opacity: 0 })

      const tl = gsap.timeline()
      tl
        // 1 — MALLYS slams in on a blank stage, holds, clears
        .from(title.querySelectorAll('.mch'), { yPercent: 120, opacity: 0, stagger: 0.05, duration: 1, ease: 'power4.out' }, 0)
        .to(titleWrapRef.current, { duration: 1 }, 1)
        .to(titleWrapRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 2)
        // 2 — the redesign slides in from the right and settles (PRINT-style entrance)
        .to(after, { x: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 2.4)
        .fromTo(afterPillRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 3.6)
        .to({}, { duration: 0.9 }, 4)                                   // hold on the result
        // 3 — the old site appears beside it: after shifts right + shrinks, before slides in from left
        .to(after,  { x: () => vw() * 0.23, width: () => vw() * 0.42, duration: 1.2, ease: 'power2.inOut' }, 5)
        .to(before, { x: () => -vw() * 0.23, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 5.15)
        .fromTo(beforePillRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 6)
        .to({}, { duration: 1.3 }, 6.4)                                 // hold on the comparison
        // 4 — the old site exits, the redesign returns to centre, full (we end on the work)
        .to(beforePillRef.current, { opacity: 0, duration: 0.4 }, 7.9)
        .to(before, { x: () => -vw() * 0.62, opacity: 0, duration: 1, ease: 'power2.in' }, 8)
        .to(after,  { x: 0, width: () => vw() * 0.62, duration: 1.1, ease: 'power2.inOut' }, 8.2)
        .to({}, { duration: 0.7 }, 9.3)                                 // hold on the finished redesign

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

  // Brand-chip labels — they carry their own background, so they read clearly
  // over any screenshot regardless of its colours.
  const pillBase: React.CSSProperties = {
    position: 'absolute', top: '18px', left: '18px', zIndex: 4,
    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    padding: '8px 14px', borderRadius: '100px',
  }

  const cardBase: React.CSSProperties = {
    position: 'absolute', left: '50%', top: '50%', height: '74vh',
    overflow: 'hidden', borderRadius: '4px',
    boxShadow: '0 50px 110px rgba(0,0,0,0.5)', border: '0.5px solid rgba(255,255,255,0.08)',
  }

  const copy: [string, string][] = [
    ['The problem', 'The original mallys.cz lacked a clear brand voice, had a poor mobile experience and no product storytelling — a generic template that didn’t reflect the handmade craft.'],
    ['The solution', 'Full redesign in Next.js 15 — a cinematic Ken Burns hero, warm porcelain palette, bilingual CZ/EN toggle, GSAP scroll animations and a cart drawer built from scratch.'],
    ['My role', 'UX/UI design, brand direction and the full front-end build, delivered during my internship at Mallys.'],
  ]

  // ── MOBILE: stacked before / after, no pin ──
  if (!isDesktop) {
    return (
      <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)', padding: '72px 6vw 80px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px,15vw,80px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--white)', lineHeight: 1, margin: '12px 0 36px' }}>Mallys Redesign</h2>

        {([['After', AFTER_URL, 0], ['Before', BEFORE_URL, 0.45]] as [string, string, number][]).map(([label, url, gray]) => (
          <div key={label} style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: label === 'After' ? 'var(--gold)' : 'var(--muted)', display: 'block', marginBottom: '10px' }}>{label}</span>
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

  // ── DESKTOP: pinned PRINT-style reveal ──
  return (
    <>
      <section ref={sectionRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: '#000', borderTop: '0.5px solid var(--border)' }}>
        {/* eyebrow, top-left */}
        <div style={{ position: 'absolute', top: '36px', left: '7vw', zIndex: 3 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Case Study — UX Redesign</span>
        </div>

        {/* BEFORE card (old site) */}
        <div ref={beforeCardRef} style={{ ...cardBase, width: '42vw', opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BEFORE_URL} alt="Mallys original site" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', filter: 'grayscale(0.3) brightness(0.92)', display: 'block' }} />
          <span ref={beforePillRef} style={{ ...pillBase, background: 'rgba(8,8,8,0.7)', color: 'rgba(255,255,255,0.9)', border: '0.5px solid rgba(255,255,255,0.25)', opacity: 0 }}>Before</span>
        </div>

        {/* AFTER card (redesign) */}
        <div ref={afterCardRef} style={{ ...cardBase, width: '62vw', opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AFTER_URL} alt="Mallys redesign" onLoad={() => ScrollTrigger.refresh()} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
          <span ref={afterPillRef} style={{ ...pillBase, background: 'var(--cream)', color: '#0b0b0b', fontWeight: 700, opacity: 0 }}>After · Redesign</span>
        </div>

        {/* TITLE overlay */}
        <div ref={titleWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', background: '#000' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.4rem' }}>Case Study — UX Redesign</span>
          <h2 ref={titleRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(70px,15vw,240px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.9 }}>MALLYS</h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.4rem' }}>Scroll to reveal the redesign ↓</span>
        </div>
      </section>

      {/* Editorial — normal flow below the pin (PRINT pattern), with the one big CTA */}
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
