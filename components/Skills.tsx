'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SKILLS } from '@/lib/constants'

export default function Skills() {
  useEffect(() => {
    ScrollTrigger.create({
      trigger: '#skills-section',
      start: 'top 72%',
      onEnter: () => gsap.to('.spill', {
        opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
        stagger: { each: 0.035, from: 'random' },
      }),
    })
  }, [])

  return (
    <section id="skills-section" style={{ padding: '100px 7vw', background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Capabilities</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '56px' }}>
        The full stack,<br />front to back.
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {SKILLS.map(skill => (
          <span key={skill} className="spill" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', padding: '8px 16px',
            border: '0.5px solid rgba(255,255,255,0.09)',
            borderRadius: '100px', color: 'var(--muted)',
            cursor: 'default', opacity: 0, transform: 'translateY(20px)',
            transition: 'border-color 0.3s, color 0.3s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(232,213,183,0.4)'; (e.target as HTMLElement).style.color = 'var(--cream)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'; (e.target as HTMLElement).style.color = 'var(--muted)' }}
          >{skill}</span>
        ))}
      </div>
    </section>
  )
}
