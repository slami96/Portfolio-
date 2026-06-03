'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURED, type Project } from '@/lib/projects'

function ProjectCard({ project, hScrollRef }: { project: Project; hScrollRef: ReturnType<typeof gsap.to> | null }) {
  const visRef  = useRef<HTMLDivElement>(null)
  const titRef  = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loaded, setLoaded] = useState([false, false])

  useEffect(() => {
    if (!hScrollRef || !visRef.current || !titRef.current) return
    const frame = frameRef.current!
    gsap.fromTo(visRef.current,
      { clipPath: 'inset(0 100% 0 0 round 10px)' },
      { clipPath: 'inset(0 0% 0 0 round 10px)', ease: 'power2.out',
        // scrub 2.5 -> 1: less lag between scroll and reveal
        scrollTrigger: { trigger: frame, containerAnimation: hScrollRef, start: 'left 85%', end: 'left 30%', scrub: 1 } }
    )
    gsap.from(titRef.current,
      { yPercent: 105, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: frame, containerAnimation: hScrollRef, start: 'left 68%', toggleActions: 'play none none reverse' } }
    )
  }, [hScrollRef])

  useEffect(() => {
    const iv = setInterval(() => setActiveImg(p => p === 0 ? 1 : 0), 2800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div ref={frameRef} style={{
      width: '100vw', height: '100vh', display: 'flex',
      alignItems: 'center', flexShrink: 0, position: 'relative',
      overflow: 'hidden', background: project.bg,
    }}>
      <div style={{
        position: 'absolute', fontFamily: "'Syne', sans-serif",
        fontSize: '38vw', fontWeight: 800,
        color: 'rgba(255,255,255,0.02)', right: '-4vw', bottom: '-6vh',
        lineHeight: 1, letterSpacing: '-0.05em',
        pointerEvents: 'none', userSelect: 'none',
      }}>{project.num}</div>

      <div style={{
        display: 'grid', gridTemplateColumns: '38% 62%',
        gap: '4vw', padding: '0 7vw', width: '100%', alignItems: 'center',
      }}>
        <div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
            color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1.4rem', display: 'block',
          }}>{project.num} / 05 — {project.category}</span>

          <div style={{ overflow: 'hidden', marginBottom: '1.2rem' }}>
            <div ref={titRef} style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(28px,3.5vw,48px)',
              fontWeight: 700, lineHeight: 1.05,
              letterSpacing: '-0.025em', color: 'var(--white)',
            }}>{project.title}</div>
          </div>

          <p style={{
            fontSize: '13px', color: 'var(--muted)',
            lineHeight: 1.75, maxWidth: '320px', marginBottom: '1.6rem',
          }}>{project.description}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.8rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px', padding: '3px 8px',
                border: '0.5px solid rgba(255,255,255,0.12)',
                borderRadius: '3px', color: 'rgba(255,255,255,0.35)',
              }}>{tag}</span>
            ))}
          </div>

          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', color: 'var(--cream)',
            textDecoration: 'none', letterSpacing: '0.08em',
            borderBottom: '0.5px solid transparent',
            transition: 'border-color 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--cream)')}
          onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >
            View live →
          </a>
        </div>

        <div ref={visRef} style={{
          aspectRatio: '16/10', borderRadius: '10px',
          overflow: 'hidden', clipPath: 'inset(0 100% 0 0 round 10px)',
          willChange: 'clip-path', position: 'relative',
          background: `linear-gradient(135deg, ${project.fallbackFrom}, ${project.fallbackTo})`,
        }}>
          {[project.screenshotA, project.screenshotB].map((src, idx) => (
            <div key={idx} style={{
              position: idx === 0 ? 'relative' : 'absolute',
              inset: 0, width: '100%', height: '100%',
              opacity: activeImg === idx ? 1 : 0,
              transition: 'opacity 0.7s ease',
            }}>
              <Image
                src={src} alt={project.title}
                fill style={{ objectFit: 'cover', objectPosition: 'top center' }}
                onLoad={() => setLoaded(prev => { const n = [...prev]; n[idx] = true; return n })}
              />
            </div>
          ))}
          {!loaded[0] && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '6px',
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(18px,2vw,28px)', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{project.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em' }}>{project.category.toUpperCase()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsReel() {
  const rowRef = useRef<HTMLDivElement>(null)
  const [hScroll, setHScroll] = useState<ReturnType<typeof gsap.to> | null>(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const hs = gsap.to(row, {
      x: () => -(row.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects-wrap',
        start: 'top top',
        end: () => `+=${row.scrollWidth - window.innerWidth}`,
        pin: true, scrub: 1,            // was 2.5 — tighter tracking
        anticipatePin: 1, invalidateOnRefresh: true,
        // This section sits ABOVE the PRINT section. Higher refreshPriority means
        // its pinned space gets measured first, so PRINT lands in the right place
        // and stops overlapping the projects.
        refreshPriority: 1,
      },
    })
    setHScroll(hs)

    return () => {
      hs.scrollTrigger?.kill()
      hs.kill()
    }
  }, [])

  return (
    <div id="projects-wrap" style={{ overflow: 'hidden' }}>
      <div ref={rowRef} style={{ display: 'flex', width: 'fit-content', willChange: 'transform' }}>
        {FEATURED.map(p => <ProjectCard key={p.id} project={p} hScrollRef={hScroll} />)}
      </div>
    </div>
  )
}
