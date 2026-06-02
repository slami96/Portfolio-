'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const topRef  = useRef<HTMLDivElement>(null)
  const botRef  = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete })
    tl.to(fillRef.current,  { width: '100%', duration: 1.1, ease: 'power2.inOut' })
      .to(labelRef.current, { opacity: 0, duration: 0.3 }, '-=0.2')
      .to(topRef.current,   { yPercent: -100, duration: 0.75, ease: 'power3.inOut' }, '+=0.1')
      .to(botRef.current,   { yPercent:  100, duration: 0.75, ease: 'power3.inOut' }, '<')
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      zIndex: 10000, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px',
    }}>
      <div ref={topRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: '#000', zIndex: 1, transformOrigin: 'top',
      }} />
      <div ref={botRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        background: '#000', zIndex: 1, transformOrigin: 'bottom',
      }} />
      <div ref={labelRef} style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px', letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
        position: 'relative', zIndex: 2,
      }}>
        Loading
      </div>
      <div style={{
        width: '180px', height: '1px',
        background: 'rgba(255,255,255,0.08)',
        position: 'relative', zIndex: 2, overflow: 'hidden',
      }}>
        <div ref={fillRef} style={{
          height: '100%', width: '0%', background: 'var(--cream)',
        }} />
      </div>
    </div>
  )
}
