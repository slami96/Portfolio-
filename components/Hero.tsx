'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'

const ThreeBackground = dynamic(() => import('./ThreeBackground'), { ssr: false })

function splitChars(el: HTMLElement) {
  const text = el.innerHTML.replace(/<br\s*\/?>/gi, '\n')
  el.innerHTML = text.split('').map(c => {
    if (c === '\n') return '<br>'
    if (c === ' ') return '<span style="display:inline-block;width:0.28em"> </span>'
    return `<span class="char" style="display:inline-block;transform-origin:bottom center;will-change:transform">${c}</span>`
  }).join('')
  return el.querySelectorAll<HTMLElement>('.char')
}

function scrollToSection(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null)
  const photoRef     = useRef<HTMLDivElement>(null)
  const dividerRef   = useRef<HTMLDivElement>(null)
  const descRef      = useRef<HTMLParagraphElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const nameRef      = useRef<HTMLHeadingElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLButtonElement>(null)
  const dotRef       = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const name = nameRef.current
    if (!name) return
    const chars = splitChars(name)

    gsap.from(chars, {
      yPercent: 110, rotateX: -80, opacity: 0,
      duration: 0.9, ease: 'power4.out', stagger: 0.04,
    })
    gsap.to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' })
    gsap.to(photoRef.current,    { clipPath: 'circle(78% at 65% 50%)', duration: 1.3, delay: 0.2, ease: 'power3.out' })
    gsap.to(dividerRef.current,  { width: '100%', duration: 0.9, delay: 0.7, ease: 'power2.out' })
    gsap.to(descRef.current,     { opacity: 1, duration: 0.7, delay: 0.85, ease: 'power2.out' })
    gsap.to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.6, delay: 1.0, ease: 'power2.out' })
    gsap.to(scrollCueRef.current, { opacity: 1, duration: 0.6, delay: 1.4 })

    const dotTween = gsap.to(dotRef.current, {
      y: 9, opacity: 0.25, duration: 1.1, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
    return () => { dotTween.kill() }
  }, [])

  return (
    <section ref={sectionRef} style={{
      height: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', background: 'var(--bg)',
    }}>
      <ThreeBackground />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 7vw', width: '56%' }}>
        <p ref={eyebrowRef} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px', letterSpacing: '0.2em',
          color: 'var(--gold)', textTransform: 'uppercase',
          marginBottom: '2rem', opacity: 0, transform: 'translateY(8px)',
        }}>
          Creative Developer &amp; UX Designer
        </p>

        <h1 ref={nameRef} style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(48px,7vw,96px)',
          fontWeight: 800, lineHeight: 0.9,
          letterSpacing: '-0.04em', color: 'var(--white)',
          marginBottom: '2.2rem',
        }}>
          ADAM<br />SLAMEN
        </h1>

        <div ref={dividerRef} style={{
          width: '0%', height: '0.5px',
          background: 'rgba(232,213,183,0.2)',
          marginBottom: '2rem',
        }} />

        <p ref={descRef} style={{
          fontSize: 'clamp(15px,1.35vw,19px)',
          color: 'rgba(242,240,237,0.72)', lineHeight: 1.7,
          maxWidth: '460px', marginBottom: '2.4rem', opacity: 0,
        }}>
          I help brands and startups stand out online — blending design craft
          with front-end engineering.
        </p>

        {/* Ghost CTA — matches the "View live site" buttons in the reel */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', opacity: 0, transform: 'translateY(10px)' }}>
          <button
            onClick={() => scrollToSection('#contact')}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '15px 30px', borderRadius: '100px', cursor: 'pointer',
              background: 'transparent', color: 'var(--cream)',
              border: '0.5px solid rgba(232,213,183,0.4)',
              fontWeight: 500, transition: 'background 0.3s ease, color 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = '#0b0b0b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Get in touch
          </button>
        </div>
      </div>

      {/* Scroll cue — bottom-LEFT, on the dark side, clear of the portrait.
          If your photo is actually on the LEFT in your build, change left:'7vw' → right:'7vw'
          and alignItems:'flex-start' → 'flex-end'. */}
      <button
        ref={scrollCueRef}
        onClick={() => scrollToSection('#projects-wrap')}
        aria-label="Scroll to explore work"
        style={{
          position: 'absolute', bottom: '34px', left: '7vw',
          zIndex: 3, opacity: 0, background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
          color: 'var(--cream)', padding: '6px 2px',
          transition: 'opacity 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {/* mouse outline + travelling dot (ghost / outlined — matches the CTA) */}
        <span style={{
          width: '24px', height: '38px', border: '1.5px solid rgba(232,213,183,0.55)',
          borderRadius: '13px', display: 'flex', justifyContent: 'center', paddingTop: '7px',
          boxSizing: 'border-box',
        }}>
          <span ref={dotRef} style={{ width: '3px', height: '8px', borderRadius: '2px', background: 'var(--cream)' }} />
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
          letterSpacing: '0.22em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          color: 'rgba(232,213,183,0.85)',
        }}>
          Scroll to explore work
        </span>
      </button>

      {/* Photo */}
      <div ref={photoRef} style={{
        position: 'absolute', right: 0, top: 0,
        width: '50%', height: '100%',
        clipPath: 'circle(0% at 65% 50%)',
        overflow: 'hidden', willChange: 'clip-path', zIndex: 1,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photo_me.png" alt="Adam Slamen" style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />
      </div>
    </section>
  )
}
