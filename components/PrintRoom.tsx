'use client'
import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const MIN_SECS = 9
    const MAX_SPEED = 1 / (MIN_SECS * 60)
    const TL_TOTAL = 38.5
    const SCROLL_DIST = window.innerHeight * 9

    let rawProgress = 0, currentProgress = 0, inSection = false

    const tl = gsap.timeline({ paused: true })

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

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: () => `+=${SCROLL_DIST}`,
      pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
      onEnter: () => { inSection = true },
      onLeave: () => { inSection = false },
      onEnterBack: () => { inSection = true },
      onLeaveBack: () => { inSection = false },
      onUpdate: (self) => { rawProgress = self.progress },
    })

    gsap.ticker.add(() => {
      if (!inSection && currentProgress <= 0) return
      const delta = rawProgress - currentProgress
      const abs = Math.abs(delta)
      if (abs < 0.00005) return
      currentProgress = Math.max(0, Math.min(1, currentProgress + (abs > MAX_SPEED ? Math.sign(delta) * MAX_SPEED : delta * 0.12)))
      tl.progress(currentProgress * (tl.totalDuration() / TL_TOTAL))
    })

    // Wave animations
    const waveData = [
      { el: sw1.current, alt: 'M0,0 Q100,60 190,28 Q270,0 370,55 Q470,105 580,42 Q650,10 700,32 L700,0 Z' },
      { el: sw2.current, alt: 'M0,0 Q130,95 240,50 Q350,8 460,68 Q570,120 700,65 L700,0 Z' },
      { el: sw3.current, alt: 'M0,160 Q100,88 210,115 Q330,142 450,90 Q575,42 700,82 L700,160 Z' },
      { el: sw4.current, alt: 'M0,160 Q160,65 285,102 Q420,136 545,65 Q640,28 700,52 L700,160 Z' },
    ]
    waveData.forEach(({ el, alt }, i) => {
      if (el) gsap.to(el, { attr: { d: alt }, duration: 3.5 + i * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.35 })
    })

    // TATRALINE tilt
    const card = trCardOuter.current, tilt = trTiltRef.current
    if (card && tilt) {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        gsap.to(tilt, { rotateY: x * 14, rotateX: -y * 9, transformPerspective: 1200, ease: 'power1.out', duration: 0.35 })
      }
      const onLeave = () => gsap.to(tilt, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
    }
  }, [])

  const editorialWrap: React.CSSProperties = { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '58% 42%', alignItems: 'center', padding: '80px 7vw 60px', gap: '5vw', opacity: 0, pointerEvents: 'none' }
  const szEditColors = { projectNum: '#4F6E88', venueName: '#1a2a36', venueSub: '#7a8a94', detailLabel: '#4F6E88', detailText: '#3a4a54', divider: 'rgba(79,110,136,0.2)' }
  const trEditColors = { projectNum: '#2C4A3E', venueName: '#1a2a22', venueSub: '#7a8a7a', detailLabel: '#2C4A3E', detailText: '#2e3e34', divider: 'rgba(44,74,62,0.2)' }

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

  return (
    <section ref={sectionRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden', borderTop: '0.5px solid var(--border)' }}>
      {/* Backgrounds */}
      <div ref={szBgRef} style={{ position: 'absolute', inset: 0, background: '#EDE8E0', opacity: 0, pointerEvents: 'none' }} />
      <div ref={trBgRef} style={{ position: 'absolute', inset: 0, background: '#F0EBE0', opacity: 0, pointerEvents: 'none' }} />

      {/* Eyebrow */}
      <div ref={eyebrowRef} style={{ position: 'absolute', top: '36px', left: '7vw', right: '7vw', display: 'flex', justifyContent: 'space-between', opacity: 0, zIndex: 20, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Print Media</span>
        <span ref={countRef} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', color: 'var(--muted)' }}>01 / 02</span>
      </div>

      {/* Slam */}
      <div ref={slamRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(80px,18vw,220px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1, willChange: 'transform,opacity', transformOrigin: 'center' }}>PRINT</div>
      </div>

      {/* Count tick */}
      <div ref={tickRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, zIndex: 8, pointerEvents: 'none' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(60px,12vw,140px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1 }}>02</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '12px' }}>Tatraline / High Tatras</div>
      </div>

      {/* SEZNER entrance */}
      <div ref={szEntranceRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, pointerEvents: 'none', zIndex: 5 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={szEntranceImgRef} src="/menu-images/s1.jpg" alt="Sezner cover" style={{ height: '78vh', width: 'auto', borderRadius: '3px', boxShadow: '0 60px 120px rgba(0,0,0,0.35)', willChange: 'transform', transformOrigin: 'center bottom' }} />
      </div>

      {/* SEZNER editorial */}
      <div ref={szEditorialRef} style={{ ...editorialWrap, background: '#EDE8E0' }}>
        <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
          <div ref={szCardRef} style={{ height: '100%' }}>
            <Image src="/menu-images/s2.jpg" alt="Sezner interior" height={800} width={560} style={{ height: '100%', width: 'auto', borderRadius: '3px', boxShadow: '0 40px 90px rgba(0,0,0,0.22)', objectFit: 'contain' }} />
          </div>
        </div>
        <div ref={szInfoRef}>
          {infoSection(szEditColors, '01 / 02', 'SEZNER', 'Mountain Restaurant · Graubünden, CH', [
            ['Identity', 'Topographic coordinate branding — the exact GPS location as the central design element. The contour-line logo maps the mountain silhouette above the valley.'],
            ['Design Language', 'Organic mountain wave shapes in slate blue and cream, layered with depth. Terracotta accent carries warmth against the cold alpine palette.'],
            ['Scope', 'Full menu system — drinks, food, alpine specials. Bilingual German service. Designed for a full mountain season.'],
          ])}
        </div>
      </div>

      {/* TATRALINE entrance */}
      <div ref={trEntranceRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, pointerEvents: 'none', zIndex: 5 }}>
        <div style={{ position: 'relative', overflow: 'hidden', height: '78vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={trEntranceImgRef} src="/menu-images/t1.jpg" alt="Tatraline cocktail menu" style={{ height: '78vh', width: 'auto', borderRadius: '3px', boxShadow: '0 60px 120px rgba(0,0,0,0.35)', display: 'block' }} />
          <div ref={illusCoverRef} style={{ position: 'absolute', inset: 0, background: '#F0EBE0', transformOrigin: 'top' }} />
        </div>
      </div>

      {/* TATRALINE editorial */}
      <div ref={trEditorialRef} style={{ ...editorialWrap, background: '#F0EBE0' }}>
        <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
          <div ref={trCardRef} style={{ height: '100%' }}>
            <Image src="/menu-images/t1.jpg" alt="Tatraline cocktails" height={800} width={560} style={{ height: '100%', width: 'auto', borderRadius: '3px', boxShadow: '0 40px 90px rgba(0,0,0,0.22)', objectFit: 'contain' }} />
          </div>
        </div>
        <div ref={trInfoRef}>
          {infoSection(trEditColors, '02 / 02', 'TATRALINE', 'Cocktail Bar · High Tatras, SK', [
            ['Illustration', 'Hand-drawn glassware and bottle illustrations — each category gets its own visual. The martini glass, the tumbler, the coffee cup. Drawn to feel like a bartender\'s notebook.'],
            ['Typography', 'Bold condensed display for cocktail names, editorial body in classic serif. The contrast signals craft — premium but approachable, like the bar itself.'],
            ['Scope', '7-page full bar menu — cocktails, rum, whiskey, tequila, vodka, likéry, coffee and food. Designed for the Tatras mountain hospitality scene.'],
          ])}
        </div>
      </div>

      {/* TATRALINE tilt card (hidden outside editorial, for tilt effect reference) */}
      <div ref={trCardOuter} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <div ref={trTiltRef} />
      </div>
    </section>
  )
}
