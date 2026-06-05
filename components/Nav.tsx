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

    // The logo belongs to the hero. Fade it out as the hero scrolls past and
    // leave it gone — no more hide/show "popping" that fought with the content.
    const tween = gsap.to(nav, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => window.innerHeight * 0.85,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
          nav.style.pointerEvents = self.progress > 0.95 ? 'none' : 'auto'
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 500, padding: '26px 7vw',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      willChange: 'opacity',
    }}>
      <a href="#" aria-label="Home" style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
        <svg width="68" height="60" viewBox="0 0 781 697" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0,697) scale(0.1,-0.1)" fill="#F2F0ED" stroke="none">
            <path d={LOGO_PATH} />
          </g>
        </svg>
      </a>
    </nav>
  )
}
