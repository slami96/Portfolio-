'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function MallysGlitch() {
  const sceneRef   = useRef<HTMLDivElement>(null)
  const oldWrapRef = useRef<HTMLDivElement>(null)
  const newWrapRef = useRef<HTMLDivElement>(null)
  const redRef     = useRef<HTMLImageElement>(null)
  const cyanRef    = useRef<HTMLImageElement>(null)
  const scanRef    = useRef<HTMLDivElement>(null)
  const flashRef   = useRef<HTMLDivElement>(null)
  const barsRef    = useRef<HTMLCanvasElement>(null)
  const badgeRef   = useRef<HTMLSpanElement>(null)

  const isNewRef     = useRef(false)
  const inViewRef    = useRef(false)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function runGlitch(toNew: boolean, onDone?: () => void) {
    const oldWrap = oldWrapRef.current
    const newWrap = newWrapRef.current
    const red = redRef.current, cyan = cyanRef.current
    const scan = scanRef.current, flash = flashRef.current
    const bars = barsRef.current

    if (!oldWrap || !newWrap || !red || !cyan || !scan || !flash) return

    const ctx = bars?.getContext('2d')
    let barsIv: ReturnType<typeof setInterval> | null = null
    if (ctx && bars) {
      bars.width  = bars.offsetWidth
      bars.height = bars.offsetHeight
      barsIv = setInterval(() => {
        ctx.clearRect(0, 0, bars.width, bars.height)
        for (let i = 0; i < 12; i++) {
          const y = Math.random() * bars.height
          const h = Math.random() * 12 + 2
          const ox = (Math.random() - 0.5) * 40
          ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 200 : 0},0,${Math.random() > 0.5 ? 200 : 0},0.18)`
          ctx.fillRect(ox, y, bars.width, h)
        }
      }, 55)
    }

    const [showEl, hideEl] = toNew ? [newWrap, oldWrap] : [oldWrap, newWrap]

    const tl = gsap.timeline({
      onComplete: () => {
        if (barsIv) { clearInterval(barsIv); ctx?.clearRect(0, 0, bars!.width, bars!.height) }
        onDone?.()
      }
    })

    tl
      .to([red, cyan], { opacity: 0.55, duration: 0.12, ease: 'none' }, 0)
      .to(red,  { x: 10, duration: 0.12, ease: 'none' }, 0)
      .to(cyan, { x: -10, duration: 0.12, ease: 'none' }, 0)
      .to(scan, { opacity: 0.9, duration: 0.1 }, 0.05)
      .to(red,  { x: -25, duration: 0.07, ease: 'none' }, 0.18)
      .to(cyan, { x:  25, duration: 0.07, ease: 'none' }, 0.18)
      .to(red,  { x:  35, opacity: 0.8, duration: 0.06, ease: 'none' }, 0.28)
      .to(cyan, { x: -35, opacity: 0.8, duration: 0.06, ease: 'none' }, 0.28)
      .to(flash, { opacity: 1, duration: 0.06, ease: 'none' }, 0.46)
      .set(hideEl, { opacity: 0 }, 0.5)
      .set(showEl, { opacity: 1 }, 0.5)
      .to(flash, { opacity: 0, duration: 0.22, ease: 'power2.out' }, 0.52)
      .to([red, cyan, scan], { opacity: 0, x: 0, duration: 0.2 }, 0.5)
  }

  function scheduleLoop() {
    if (!inViewRef.current) return            // don't queue work while off screen
    loopTimerRef.current = setTimeout(() => {
      if (!inViewRef.current) return
      const toNew = !isNewRef.current
      isNewRef.current = toNew
      runGlitch(toNew, () => scheduleLoop())
    }, 2800)
  }

  useEffect(() => {
    if (!sceneRef.current) return

    const st = ScrollTrigger.create({
      trigger: sceneRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        if (inViewRef.current) return
        inViewRef.current = true
        isNewRef.current = true
        runGlitch(true, () => scheduleLoop())
      },
      onEnterBack: () => {
        if (inViewRef.current) return
        inViewRef.current = true
        scheduleLoop()
      },
      onLeave: () => {
        inViewRef.current = false
        if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      },
      onLeaveBack: () => {
        inViewRef.current = false
        if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      },
    })

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      st.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imgStyle: React.CSSProperties = {
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'top center', display: 'block',
  }
  const layerStyle: React.CSSProperties = { position: 'absolute', inset: 0 }

  return (
    <section style={{ background: 'var(--bg2)', borderTop: '0.5px solid var(--border)' }}>
      {/* Header */}
      <div style={{ padding: '100px 7vw 60px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
          letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase',
          marginBottom: '1rem', display: 'block',
        }}>Case Study — UX Redesign</span>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",   /* was malformed: "'Syne', sans-serif'," */
          fontSize: 'clamp(34px,5vw,64px)',
          fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08,
        }}>
          Mallys · Before<br />&amp; After
        </h2>
      </div>

      {/* Glitch scene */}
      <div ref={sceneRef} style={{
        position: 'relative', width: '100%', height: '62vh',
        overflow: 'hidden', background: '#000',
      }}>
        <svg style={{ display: 'none' }}>
          <defs>
            <filter id="f-red">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
            </filter>
            <filter id="f-cyan">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
            </filter>
          </defs>
        </svg>

        {/* OLD SITE */}
        <div ref={oldWrapRef} style={{ ...layerStyle }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://image.thum.io/get/width/1400/crop/700/https://www.mallys.cz" alt="Mallys old" style={imgStyle} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={redRef} src="https://image.thum.io/get/width/1400/crop/700/https://www.mallys.cz" alt="" style={{ ...imgStyle, ...layerStyle, opacity: 0, mixBlendMode: 'screen', filter: 'url(#f-red)', pointerEvents: 'none' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={cyanRef} src="https://image.thum.io/get/width/1400/crop/700/https://www.mallys.cz" alt="" style={{ ...imgStyle, ...layerStyle, opacity: 0, mixBlendMode: 'screen', filter: 'url(#f-cyan)', pointerEvents: 'none' }} />
          <div ref={scanRef} style={{ ...layerStyle, backgroundImage: 'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.22) 3px,rgba(0,0,0,0.22) 4px)', opacity: 0, pointerEvents: 'none', zIndex: 3 }} />
          <canvas ref={barsRef} style={{ ...layerStyle, opacity: 1, pointerEvents: 'none', zIndex: 4, width: '100%', height: '100%' }} />
          <div ref={flashRef} style={{ ...layerStyle, background: '#fff', opacity: 0, pointerEvents: 'none', zIndex: 9 }} />
          <span style={{ position: 'absolute', bottom: '20px', left: '24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', background: 'rgba(0,0,0,0.55)', borderRadius: '4px', color: 'var(--muted)', backdropFilter: 'blur(6px)', zIndex: 5 }}>Before · mallys.cz</span>
        </div>

        {/* NEW SITE */}
        <div ref={newWrapRef} style={{ ...layerStyle, opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://image.thum.io/get/width/1400/crop/700/https://mallysremake-b4yb.vercel.app" alt="Mallys redesign" style={imgStyle} />
          <span ref={badgeRef} style={{ position: 'absolute', bottom: '20px', right: '24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', background: 'rgba(200,169,110,0.15)', border: '0.5px solid rgba(200,169,110,0.4)', borderRadius: '4px', color: 'var(--gold)', backdropFilter: 'blur(6px)', zIndex: 5 }}>After · Redesign</span>
        </div>
      </div>

      {/* Caption */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '32px 7vw 90px', gap: '40px', borderTop: '0.5px solid var(--border)' }}>
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
