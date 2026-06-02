'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MORE_WORK, type Project } from '@/lib/projects'
import { useState } from 'react'

function MoreCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.from(cardRef.current, {
      opacity: 0, y: 30,
      duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
    })
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setActiveImg(p => p === 0 ? 1 : 0), 3000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div ref={cardRef} style={{ background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden', border: '0.5px solid var(--border)' }}>
      {/* Screenshot */}
      <div style={{ aspectRatio: '16/10', position: 'relative', background: `linear-gradient(135deg,${project.fallbackFrom},${project.fallbackTo})` }}>
        {[project.screenshotA, project.screenshotB].map((src, idx) => (
          <div key={idx} style={{ position: idx === 0 ? 'relative' : 'absolute', inset: 0, width: '100%', height: '100%', opacity: activeImg === idx ? 1 : 0, transition: 'opacity 0.7s ease' }}>
            <Image src={src} alt={project.title} fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
          </div>
        ))}
      </div>
      {/* Info */}
      <div style={{ padding: '20px 22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase' }}>{project.category}</span>
          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--cream)', textDecoration: 'none', letterSpacing: '0.1em', borderBottom: '0.5px solid rgba(232,213,183,0.3)', paddingBottom: '1px' }}>View →</a>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)', marginBottom: '8px' }}>{project.title}</div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '14px' }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', padding: '2px 7px', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: 'rgba(255,255,255,0.3)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MoreProjects() {
  const headRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headRef.current) return
    gsap.from(headRef.current, {
      opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
    })
  }, [])

  return (
    <section style={{ padding: '100px 7vw 110px', background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Also built</span>
      <h2 ref={headRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '56px' }}>
        More work
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {MORE_WORK.map(p => <MoreCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}
