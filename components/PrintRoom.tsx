'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

export default function PrintRoom() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const slamRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const countRef   = useRef<HTMLSpanElement>(null)
  const szBgRef    = useRef<HTMLDivElement>(null)
  const szEntranceRef = useRef<HTMLDivElement>(null)
  const szEntranceImgRef = useRef<HTMLImageElement>(null)
  const szEditorialRef   = useRef<HTMLDivElement>(null)
  const szCardRef  = useRef<HTMLDivElement>(null)
  const szInfoRef  = useRef<HTMLDivElement>(null)
  const tickRef    = useRef<HTMLDivElement>(null)
  const trBgRef    = useRef<HTMLDivElement>(null)
  const trEntranceRef = useRef<HTMLDivElement>(null)
  const trEntranceImgRef = useRef<HTMLImageElement>(null)
  const illusCoverRef = useRef<HTMLDivElement>(null)
  const trEditorialRef = useRef<HTMLDivElement>(null)
  const trCardRef  = useRef<HTMLDivElement>(null)
  const trInfoRef  = useRef<HTMLDivElement>(null)
  const sw1 = useRef<SVGPathElement>(null)
  const sw2 = useRef<SVGPathElement>(null)
  const sw3 = useRef<SVGPathElement>(null)
  const sw4 = useRef<SVGPathElement>(null)
  const trCardOuter = useRef<HTMLDivElement>(null)
  const trTiltRef = useRef<HTMLDivElement>(null)

  // Default to the desktop "film" on the server so SSR markup is stable.
  // We correct on mount: phones get a simple stacked layout instead, because
  // the pinned scroll-film is heavy and fragile on touch devices.
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

    // Longer pinned distance = more wheel travel per beat, so fast scrolling
    // can't blow past the two menu cards. (Was *5, which felt too quick.)
    const SCROLL_DIST = window.innerHeight * 8

    // Build the timeline ONCE. We hand it straight to ScrollTrigger with
    // `scrub`, so it maps 1:1 to scroll position. No custom smoothing loop,
    // which is what made the menu card appear "too soon" before.
    const tl = gsap.timeline()

    tl
      .fromTo(slamRef.current,   { x: '-110vw', opacity: 0 }, { x: '0vw', opacity: 1, duration: 1.5, ease: 'power3.out' }, 0)
      .to(slamRef.current, { duration: 2 }, 1.5)
      .to(slamRef.current, { scale: 0.1, x: '-35vw', y: '-44vh', opacity: 0, duration: 2, ease: 'power2.inOut' }, 3.5)
      .to(eyebrowRef.current, { opacity: 1, duration: 0.8 }, 4.5)
      .to(szBgRef.current,  { opacity: 1, duration: 1.5 }, 5.0)
      .to(szEntranceRef.current, { opacity: 1, duration: 0.8 }, 5.5)
      .fromTo(szEntranceImgRef.current,
        { y: 120, rotateX: 28, scale: 0.72, transformPerspective: 1200 },
        { y: 0, rotateX: 0, scale: 1, duration: 2.5, ease: 'power2.out' }, 5.5)
      .to(szEntranceRef.current, { duration: 2.5 }, 8)
      .to(szEntranceRef.current, { opacity: 0, duration: 1 }, 10.5)
      .to(szEditorialRef.current, { opacity: 1, duration: 0.1 }, 11.3)
      .fromTo(szCardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 11.4)
      .fromTo(szInfoRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 11.9)
      .to(szEditorialRef.current, { duration: 5 }, 13)
      .to([szEditorialRef.current, szBgRef.current], { opacity: 0, duration: 1.2 }, 18.5)
      .to(tickRef.current,  { opacity: 1, duration: 0.8 }, 19.5)
      .to(tickRef.current,  { duration: 1.5 }, 20.3)
      .to(tickRef.current,  { opacity: 0, duration: 0.8 }, 21.8)
      .to(countRef.current, { opacity: 0, duration: 0.3 }, 20.0)
      .set(countRef.current, { innerHTML: '02 / 02' }, 20.3)
      .to(countRef.current, { opacity: 1, duration: 0.3 }, 20.4)
      .to(trBgRef.current,  { opacity: 1, duration: 1.5 }, 21.0)
      .to(trEntranceRef.current, { opacity: 1, duration: 0.8 }, 22.0)
      .fromTo(trEntranceImgRef.current,
        { y: 140, rotateX: 25, scale: 0.68, transformPerspective: 1200 },
        { y: 0, rotateX: 0, scale: 1, duration: 2.5, ease: 'power2.out' }, 22.2)
      .fromTo(illusCoverRef.current,
        { scaleY: 1 }, { scaleY: 0, duration: 3, ease: 'power1.inOut', transformOrigin: 'top' }, 24.0)
      .to(trEntranceRef.current, { duration: 2 }, 27)
      .to(trEntranceRef.current, { opacity: 0, duration: 1 }, 29)
      .to(trEditorialRef.current, { opacity: 1, duration: 0.1 }, 29.8)
      .fromTo(trCardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 29.9)
      .fromTo(trInfoRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 30.4)
      .to(trEditorialRef.current, { duration: 5 }, 32)
      .to([trEditorialRef.current, trBgRef.current, eyebrowRef.current], { opacity: 0, duration: 1.5 }, 37)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${SCROLL_DIST}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: 1,            // <- the timeline now follows scroll directly
      animation: tl,
    })

    // Looping wave shapes (decorative, cheap). Collected so we can clean up.
    const waveData = [
      { el: sw1.current, alt: 'M0,0 Q100,60 190,28 Q270,0 370,55 Q470,105 580,42 Q650,10 700,32 L700,0 Z' },
      { el: sw2.current, alt: 'M0,0 Q130,95 240,50 Q350,8 460,68 Q570,120 700,65 L700,0 Z' },
      { el: sw3.current, alt: 'M0,160 Q100,88 210,115 Q330,142 450,90 Q575,42 700,82 L700,160 Z' },
      { el: sw4.current, alt: 'M0,160 Q160,65 285,102 Q420,136 545,65 Q640,28 700,52 L700,160 Z' },
    ]
    const waveTweens: gsap.core.Tween[] = []
    waveData.forEach(({ el, alt }, i) => {
      if (el) waveTweens.push(gsap.to(el, { attr: { d: alt }, duration: 3.5 + i * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.35 }))
    })

    // TATRALINE tilt on hover
    const card = trCardOuter.current, tilt = trTiltRef.current
    let onMove: ((e: MouseEvent) => void) | null = null
    let onLeave: (() => void) | null = null
    if (card && tilt) {
      onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        gsap.to(tilt, { rotateY: x * 14, rotateX: -y * 9, transformPerspective: 1200, ease: 'power1.out', duration: 0.35 })
      }
      onLeave = () => gsap.to(tilt, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
    }

    return () => {
      st.kill()
      tl.kill()
      waveTweens.forEach(t => t.kill())
      if (card && onMove) card.removeEventListener('mousemove', onMove)
      if (card && onLeave) card.removeEventListener('mouseleave', onLeave)
    }
  }, [isDesktop])

  const editorialWrap: React.CSSProperties = { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '58% 42%', alignItems: 'center', padding: '80px 7vw 60px', gap: '5vw', opacity: 0, pointerEvents: 'none' }
  const szEditColors = { projectNum: '#4F6E88', venueName: '#1a2a36', venueSub: '#7a8a94', detailLabel: '#4F6E88', detailText: '#3a4a54', divider: 'rgba(79,110,136,0.2)' }
  const trEditColors = { projectNum: '#2C4A3E', venueName: '#1a2a22', venueSub: '#7a8a7a', detailLabel: '#2C4A3E', detailText: '#2e3e34', divider: 'rgba(44,74,62,0.2)' }

  const szDetails: [string, string][] = [
    ['Identity', 'Topographic coordinate branding — the exact GPS location as the central design element. The contour-line logo maps the mountain silhouette above the valley.'],
    ['Design Language', 'Organic mountain wave shapes in slate blue and cream, layered with depth. Terracotta accent carries warmth against the cold alpine palette.'],
    ['Scope', 'Full menu system — drinks, food, alpine specials. Bilingual German service. Designed for a full mountain season.'],
  ]
  const trDetails: [string, string][] = [
    ['Illustration', 'Hand-drawn glassware and bottle illustrations — each category gets its own visual. The martini glass, the tumbler, the coffee cup. Drawn to feel like a bartender\'s notebook.'],
    ['Typography', 'Bold condensed display for cocktail names, editorial body in classic serif. The contrast signals craft — premium but approachable, like the bar itself.'],
    ['Scope', '7-page full bar menu — cocktails, rum, whiskey, tequila, vodka, likéry, coffee and food. Designed for the Tatras mountain hospitality scene.'],
  ]

  const infoSection = (colors: typeof szEditColors, num: string, venue: string, sub: string, details: [string,string][]) => (
    <div style={{ paddingLeft: '2vw' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.projectNum, marginBottom: '2rem', display: 'block' }}>Print Design · {num} · 2024</span>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: colors.venueName, marginBottom: '0.6rem' }}>{venue}</div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.venueSub, marginBottom: '2.5rem', display: 'block' }}>{sub}</span>
      <div style={{ height: '0.5px', background: colors.divider, marginBottom: '2rem' }} />
      {details.map(([label, text]) => (
        <div key={label} style={{ marginBottom: '1.8rem' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.detailLabel, marginBottom: '0.5rem', display: 'block' }}>{label}</span>
          <p style={{ fontSize: '13px', lineHeight: 1.7, color: colors.detailText }}>{text}</p>
        </div>
      ))}
    </div>
  )

  // ---- MOBILE: simple, reliable stacked layout (no pin, no heavy timeline) ----
  if (!isDesktop) {
    const mobileMenu = (bg: string, colors: typeof szEditColors, img: string, alt: string, num: string, venue: string, sub: string, details: [string,string][]) => (
      <div style={{ background: bg, padding: '64px 7vw' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} style={{ width: '100%', height: 'auto', borderRadius: '3px', boxShadow: '0 30px 70px rgba(0,0,0,0.2)', marginBottom: '32px', display: 'block' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.projectNum, marginBottom: '0.8rem', display: 'block' }}>Print Design · {num} · 2024</span>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px,9vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: colors.venueName, marginBottom: '0.4rem' }}>{venue}</div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.venueSub, marginBottom: '1.8rem', display: 'block' }}>{sub}</span>
        <div style={{ height: '0.5px', background: colors.divider, marginBottom: '1.6rem' }} />
        {details.map(([label, text]) => (
          <div key={label} style={{ marginBottom: '1.4rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: colors.detailLabel, marginBottom: '0.4rem', display: 'block' }}>{label}</span>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: colors.detailText }}>{text}</p>
          </div>
        ))}
      </div>
    )

    return (
      <section style={{ borderTop: '0.5px solid var(--border)' }}>
        <div style={{ padding: '64px 7vw 8px', background: 'var(--bg)' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Print Media</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px,16vw,80px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1, marginTop: '12px' }}>PRINT</h2>
        </div>
        {mobileMenu('#EDE8E0', szEditColors, '/menu-images/s1.jpg', 'Sezner menu', '01 / 02', 'SEZNER', 'Mountain Restaurant · Graubünden, CH', szDetails)}
        {mobileMenu('#F0EBE0', trEditColors, '/menu-images/t1.jpg', 'Tatraline menu', '02 / 02', 'TATRALINE', 'Cocktail Bar · High Tatras, SK', trDetails)}
      </section>
    )
  }

  // ---- DESKTOP: cinematic pinned film ----
  return (
    <section ref={sectionRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden', borderTop: '0.5px solid var(--border)' }}>
      <div ref={szBgRef} style={{ position: 'absolute', inset: 0, background: '#EDE8E0', opacity: 0, pointerEvents: 'none' }} />
      <div ref={trBgRef} style={{ position: 'absolute', inset: 0, background: '#F0EBE0', opacity: 0, pointerEvents: 'none' }} />

      <div ref={eyebrowRef} style={{ position: 'absolute', top: '36px', left: '7vw', right: '7vw', display: 'flex', justifyContent: 'space-between', opacity: 0, zIndex: 20, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Print Media</span>
        <span ref={countRef} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', color: 'var(--muted)' }}>01 / 02</span>
      </div>

      <div ref={slamRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(80px,18vw,220px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1, willChange: 'transform,opacity', transformOrigin: 'center' }}>PRINT</div>
      </div>

      <div ref={tickRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, zIndex: 8, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(60px,12vw,140px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1 }}>02</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '12px' }}>Tatraline / High Tatras</div>
      </div>

      <div ref={szEntranceRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, pointerEvents: 'none', zIndex: 5 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={szEntranceImgRef} src="/menu-images/s1.jpg" alt="Sezner cover" style={{ height: '78vh', width: 'auto', borderRadius: '3px', boxShadow: '0 60px 120px rgba(0,0,0,0.35)', willChange: 'transform', transformOrigin: 'center bottom' }} />
      </div>

      <div ref={szEditorialRef} style={{ ...editorialWrap, background: '#EDE8E0' }}>
        <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
          <div ref={szCardRef} style={{ height: '100%' }}>
            <Image src="/menu-images/s2.jpg" alt="Sezner interior" height={800} width={560} style={{ height: '100%', width: 'auto', borderRadius: '3px', boxShadow: '0 40px 90px rgba(0,0,0,0.22)', objectFit: 'contain' }} />
          </div>
        </div>
        <div ref={szInfoRef}>
          {infoSection(szEditColors, '01 / 02', 'SEZNER', 'Mountain Restaurant · Graubünden, CH', szDetails)}
        </div>
      </div>

      <div ref={trEntranceRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, pointerEvents: 'none', zIndex: 5 }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '78vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={trEntranceImgRef} src="/menu-images/t1.jpg" alt="Tatraline cocktail menu" style={{ height: '78vh', width: 'auto', borderRadius: '3px', boxShadow: '0 60px 120px rgba(0,0,0,0.35)', display: 'block' }} />
          <div ref={illusCoverRef} style={{ position: 'absolute', inset: 0, background: '#F0EBE0', transformOrigin: 'top' }} />
        </div>
      </div>

      <div ref={trEditorialRef} style={{ ...editorialWrap, background: '#F0EBE0' }}>
        <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
          <div ref={trCardRef} style={{ height: '100%' }}>
            <Image src="/menu-images/t2.jpg" alt="Tatraline cocktails — page 2" height={800} width={560} style={{ height: '100%', width: 'auto', borderRadius: '3px', boxShadow: '0 40px 90px rgba(0,0,0,0.22)', objectFit: 'contain' }} />
          </div>
        </div>
        <div ref={trInfoRef}>
          {infoSection(trEditColors, '02 / 02', 'TATRALINE', 'Cocktail Bar · High Tatras, SK', trDetails)}
        </div>
      </div>

      <div ref={trCardOuter} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <div ref={trTiltRef} />
      </div>
    </section>
  )
}
