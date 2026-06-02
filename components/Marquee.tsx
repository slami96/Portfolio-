'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MARQUEE_ITEMS } from '@/lib/constants'

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    gsap.to(track, {
      x: -half, duration: 28, ease: 'none', repeat: -1,
      modifiers: { x: gsap.utils.unitize((x: number) => parseFloat(String(x)) % half) },
    })
  }, [])

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div style={{
      overflow: 'hidden', padding: '16px 0',
      borderTop: '0.5px solid var(--border)',
      borderBottom: '0.5px solid var(--border)',
    }}>
      <div ref={trackRef} style={{
        display: 'flex', width: 'max-content', willChange: 'transform',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'var(--muted)', textTransform: 'uppercase',
            padding: '0 30px', whiteSpace: 'nowrap',
            borderRight: '0.5px solid var(--border)', flexShrink: 0,
          }}>
            <span style={{ color: 'var(--cream)', marginRight: '8px', opacity: 0.5 }}>·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
