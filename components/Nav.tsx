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
      {/* Logo — doubled in size (was 34x30) */}
      <a href="#" aria-label="Home" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
        <svg width="68" height="60" viewBox="0 0 781 697" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,697) scale(0.1,-0.1)" fill="#F2F0ED" stroke="none">
            <path d={LOGO_PATH} />
          </g>
        </svg>
      </a>
      {/* "Get in touch" was here — moved into the hero where it's actually visible. */}
    </nav>
  )
}
