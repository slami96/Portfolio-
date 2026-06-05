'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MORE_WORK, type Project } from '@/lib/projects'

function MoreCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
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

  const enter = () => {
    const card = cardRef.current, arrow = arrowRef.current, imgWrap = imgWrapRef.current
    if (card) { card.style.transform = 'translateY(-6px)'; card.style.borderColor = 'rgba(232,213,183,0.45)' }
    if (arrow) { arrow.style.background = 'var(--cream)'; arrow.style.color = '#0b0b0b'; arrow.style.borderColor = 'var(--cream)' }
    if (imgWrap) imgWrap.style.transform = 'scale(1.04)'
  }
  const leave = () => {
    const card = cardRef.current, arrow = arrowRef.current, imgWrap = imgWrapRef.current
    if (card) { card.style.transform = 'translateY(0)'; card.style.borderColor = 'var(--border)' }
    if (arrow) { arrow.style.background = 'rgba(8,8,8,0.55)'; arrow.style.color = 'var(--cream)'; arrow.style.borderColor = 'rgba(232,213,183,0.4)' }
    if (imgWrap) imgWrap.style.transform = 'scale(1)'
  }

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} live site`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        display: 'block', background: 'var(--bg2)', borderRadius: '12px', overflow: 'hidden',
        border: '0.5px solid var(--border)', textDecoration: 'none', cursor: 'pointer',
        transition: 'transform 0.4s ease, border-color 0.4s ease', willChange: 'transform',
      }}
    >
      {/* Screenshot */}
      <div style={{ aspectRatio: '16/10', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg,${project.fallbackFrom},${project.fallbackTo})` }}>
        <div ref={imgWrapRef} style={{ position: 'absolute', inset: 0, transition: 'transform 0.5s ease', willChange: 'transform' }}>
          {[project.screenshotA, project.screenshotB].map((src, idx) => (
            <div key={idx} style={{ position: idx === 0 ? 'relative' : 'absolute', inset: 0, width: '100%', height: '100%', opacity: activeImg === idx ? 1 : 0, transition: 'opacity 0.7s ease' }}>
              <Image src={src} alt={project.title} fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          ))}
        </div>
        {/* Visit affordance — brightens on card hover */}
        <div ref={arrowRef} style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 2,
          width: '34px', height: '34px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(8,8,8,0.55)', border: '0.5px solid rgba(232,213,183,0.4)',
          color: 'var(--cream)', backdropFilter: 'blur(6px)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
          transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        }}>↗</div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 22px 24px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{project.category}</span>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)', marginBottom: '8px' }}>{project.title}</div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '14px' }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', padding: '2px 7px', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: 'rgba(255,255,255,0.3)' }}>{t}</span>
          ))}
        </div>
      </div>
    </a>
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
