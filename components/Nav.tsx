'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LOGO_PATH } from '@/lib/constants'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    let lastY = 0

    // Smart nav: hide on scroll down, show on scroll up
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate(self) {
        const y = self.scroll()
        if (y > lastY && y > 100) {
          gsap.to(nav, { yPercent: -100, duration: 0.4, ease: 'power2.inOut', overwrite: true })
        } else {
          gsap.to(nav, { yPercent: 0, duration: 0.4, ease: 'power2.out', overwrite: true })
        }
        lastY = y
      },
    })
  }, [])

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 500, padding: '26px 7vw',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      willChange: 'transform',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
        <svg width="34" height="30" viewBox="0 0 781 697" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,697) scale(0.1,-0.1)" fill="#F2F0ED" stroke="none">
            <path d={LOGO_PATH} />
          </g>
        </svg>
      </a>
      <a href="#contact" style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px', letterSpacing: '0.15em',
        color: 'var(--muted)', textDecoration: 'none',
        textTransform: 'uppercase',
        borderBottom: '0.5px solid rgba(255,255,255,0.15)',
        paddingBottom: '2px',
        transition: 'color 0.3s, border-color 0.3s',
      }}
      onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--white)'; (e.target as HTMLElement).style.borderBottomColor = 'var(--white)' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--muted)'; (e.target as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.15)' }}
      >
        Get in touch →
      </a>
    </nav>
  )
}
