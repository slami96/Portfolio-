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

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const dividerRef  = useRef<HTMLDivElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const nameRef     = useRef<HTMLHeadingElement>(null)

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
    gsap.to('.hero-pill',        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, delay: 1.0, ease: 'power2.out' })
    gsap.to(scrollRef.current,   { opacity: 1, duration: 0.5, delay: 1.3 })
    gsap.to(scrollLineRef.current, { scaleX: 1, duration: 0.7, delay: 1.35, ease: 'power2.out' })
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
          fontSize: 'clamp(13px,1.2vw,16px)',
          color: 'var(--muted)', lineHeight: 1.8,
          maxWidth: '400px', marginBottom: '2.8rem', opacity: 0,
        }}>
          Building digital experiences where design craft meets technical
          precision — from the Alpine peaks of Slovakia to the studios of Denmark.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: 'absolute', bottom: '34px', left: '7vw',
        zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px', letterSpacing: '0.2em',
        color: 'var(--muted)', textTransform: 'uppercase', opacity: 0,
      }}>
        <div ref={scrollLineRef} style={{
          width: '40px', height: '0.5px', background: 'var(--muted)',
          transform: 'scaleX(0)', transformOrigin: 'left',
        }} />
        Scroll
      </div>
    </section>
  )
}
