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

// Smooth-scroll to a section using Lenis if present, else native fallback.
function scrollToSection(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: object) => void } }).lenis
  if (lenis) lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const dividerRef  = useRef<HTMLDivElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const nameRef     = useRef<HTMLHeadingElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLButtonElement>(null)
  const dotRef      = useRef<HTMLSpanElement>(null)

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
    gsap.to('.hero-pill',        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, delay: 1.15, ease: 'power2.out' })
    gsap.to(scrollCueRef.current, { opacity: 1, duration: 0.6, delay: 1.4 })

    // Looping bounce on the scroll-cue dot
    const dotTween = gsap.to(dotRef.current, {
      y: 16, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true,
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

        {/* New, professional, readable intro (option C) */}
        <p ref={descRef} style={{
          fontSize: 'clamp(15px,1.35vw,19px)',
          color: 'rgba(242,240,237,0.72)', lineHeight: 1.7,
          maxWidth: '460px', marginBottom: '2.4rem', opacity: 0,
        }}>
          I help brands and startups stand out online — blending design craft
          with front-end engineering.
        </p>

        {/* CTAs (moved out of the nav, now front and centre) */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '2.4rem', opacity: 0, transform: 'translateY(10px)' }}>
          <button
            onClick={() => scrollToSection('#contact')}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '14px 26px', borderRadius: '100px', cursor: 'pointer',
              background: 'var(--cream)', color: '#0b0b0b', border: '0.5px solid var(--cream)',
              fontWeight: 700, transition: 'transform 0.3s ease, background 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Get in touch
          </button>
          <button
            onClick={() => scrollToSection('#projects-wrap')}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '14px 26px', borderRadius: '100px', cursor: 'pointer',
              background: 'transparent', color: 'var(--white)',
              border: '0.5px solid rgba(255,255,255,0.25)',
              transition: 'border-color 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cream)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            View work
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['Next.js 16','GSAP','Three.js','UX Design','Vercel'].map(tag => (
            <span key={tag} className="hero-pill" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px', padding: '4px 11px',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '100px', color: 'var(--muted)',
              opacity: 0, transform: 'translateY(8px)',
            }}>{tag}</span>
          ))}
        </div>

        {/* Scroll cue — bigger, centred under the text, clickable, animated */}
        <button
          ref={scrollCueRef}
          onClick={() => scrollToSection('#projects-wrap')}
          aria-label="Scroll to work"
          style={{
            opacity: 0, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            margin: '0 auto', padding: '8px', color: 'var(--muted)',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>Scroll</span>
          <span style={{ position: 'relative', width: '1px', height: '46px', background: 'rgba(255,255,255,0.18)' }}>
            <span ref={dotRef} style={{
              position: 'absolute', top: 0, left: '-2px',
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'var(--cream)',
            }} />
          </span>
        </button>
      </div>

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
