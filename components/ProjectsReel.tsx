'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FEATURED, type Project } from '@/lib/projects'

function hostOf(url: string) {
  try { return new URL(url).host } catch { return url.replace(/^https?:\/\//, '') }
}

// Shown behind the screenshots — visible if an image is missing.
function Placeholder({ project }: { project: Project }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', textAlign: 'center', padding: '20px' }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(16px,1.8vw,26px)', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{project.title}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>{project.category.toUpperCase()}</div>
    </div>
  )
}

function BrowserFrame({ project, activeImg }: { project: Project; activeImg: number }) {
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.12)', background: '#0a0a0a', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: '#141414', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
        </div>
        <div style={{ flex: 1, maxWidth: 300, margin: '0 auto', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--muted)', background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '4px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {hostOf(project.url)}
        </div>
        <span style={{ width: 33, flexShrink: 0 }} aria-hidden />
      </div>
      {/* cover + top center: frame fills edge-to-edge (no bars). Only the bottom
          of a tall page is cropped — the hero/top always shows, nothing clipped on the sides. */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', background: `linear-gradient(135deg,${project.fallbackFrom},${project.fallbackTo})` }}>
        <Placeholder project={project} />
        {[project.screenshotA, project.screenshotB].map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={idx} src={src} alt={project.title}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: activeImg === idx ? 1 : 0, transition: 'opacity 0.7s ease' }} />
        ))}
      </div>
    </div>
  )
}

function PhoneFrame({ project, activeImg }: { project: Project; activeImg: number }) {
  const imgs = [project.mobileA, project.mobileB]
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', height: 'min(74vh, 620px)', aspectRatio: '9 / 19.5', background: '#0b0b0b', borderRadius: 42, padding: 9, boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 84, height: 24, background: '#000', borderRadius: 14, zIndex: 3 }} />
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 34, overflow: 'hidden', background: `linear-gradient(160deg,${project.fallbackFrom},${project.fallbackTo})` }}>
          <Placeholder project={project} />
          {imgs.map((src, idx) => src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={idx} src={src} alt={project.title}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: activeImg === idx ? 1 : 0, transition: 'opacity 0.7s ease' }} />
          ) : null)}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, hScrollRef, index, isGroupStart }: {
  project: Project; hScrollRef: ReturnType<typeof gsap.to> | null; index: number; isGroupStart: boolean
}) {
  const visRef   = useRef<HTMLDivElement>(null)
  const titRef   = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (!hScrollRef || !visRef.current || !titRef.current) return
    const frame = frameRef.current!
    if (project.device === 'browser') {
      gsap.fromTo(visRef.current,
        { clipPath: 'inset(0 100% 0 0 round 10px)' },
        { clipPath: 'inset(0 0% 0 0 round 10px)', ease: 'power2.out',
          scrollTrigger: { trigger: frame, containerAnimation: hScrollRef, start: 'left 85%', end: 'left 30%', scrub: 1 } })
    } else {
      gsap.fromTo(visRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: frame, containerAnimation: hScrollRef, start: 'left 90%', end: 'left 45%', scrub: 1 } })
    }
    gsap.from(titRef.current,
      { yPercent: 105, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: frame, containerAnimation: hScrollRef, start: 'left 68%', toggleActions: 'play none none reverse' } })
  }, [hScrollRef]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const iv = setInterval(() => setActiveImg(p => p === 0 ? 1 : 0), 2800)
    return () => clearInterval(iv)
  }, [])

  const visualInitial: React.CSSProperties = project.device === 'browser'
    ? { clipPath: 'inset(0 100% 0 0 round 10px)', willChange: 'clip-path' }
    : { opacity: 0, willChange: 'transform, opacity' }

  return (
    <div ref={frameRef} style={{
      width: '100vw', height: '100vh', display: 'flex',
      alignItems: 'center', flexShrink: 0, position: 'relative',
      overflow: 'hidden', background: project.bg,
    }}>
      <div style={{
        position: 'absolute', fontFamily: "'Syne', sans-serif",
        fontWeight: 800, color: 'rgba(255,255,255,0.025)',
        right: '-2vw', bottom: '-4vh', lineHeight: 0.9,
        letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none',
        whiteSpace: 'nowrap',
        fontSize: isGroupStart ? 'clamp(60px,13vw,220px)' : '38vw',
      }}>
        {isGroupStart ? project.group.toUpperCase() : project.num}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '38% 62%',
        gap: '4vw', padding: '0 7vw', width: '100%', alignItems: 'center',
      }}>
        {/* Meta */}
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'block' }}>
            {project.group}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1.4rem', display: 'block' }}>
            {String(index + 1).padStart(2, '0')} / {String(FEATURED.length).padStart(2, '0')} — {project.category}
          </span>

          <div style={{ overflow: 'hidden', marginBottom: '1.2rem' }}>
            <div ref={titRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em', color: 'var(--white)' }}>{project.title}</div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '320px', marginBottom: '1.8rem' }}>{project.description}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', padding: '3px 8px', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: 'rgba(255,255,255,0.35)' }}>{tag}</span>
            ))}
          </div>

          {/* Promoted, unmissable primary action */}
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--cream)', textDecoration: 'none', fontWeight: 500,
              padding: '13px 24px', border: '0.5px solid rgba(232,213,183,0.4)',
              borderRadius: '100px', transition: 'background 0.3s ease, color 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = '#0b0b0b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            View live site ↗
          </a>
        </div>

        {/* Visual — the whole device frame is also a link */}
        <div ref={visRef} style={visualInitial}>
          <a
            href={project.url} target="_blank" rel="noopener noreferrer"
            aria-label={`Open ${project.title} live site`}
            style={{ display: 'block', cursor: 'pointer', transition: 'transform 0.4s ease', willChange: 'transform' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
          >
            {project.device === 'iphone'
              ? <PhoneFrame project={project} activeImg={activeImg} />
              : <BrowserFrame project={project} activeImg={activeImg} />}
          </a>
        </div>
      </div>
    </div>
  )
}

function IntroPanel({ introRef }: { introRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div style={{ width: '100vw', height: '100vh', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        Portfolio
      </span>
      <div ref={introRef} style={{ textAlign: 'center', lineHeight: 0.92 }}>
        {['SELECTED', 'WORK'].map(w => (
          <div key={w} style={{ overflow: 'hidden' }}>
            <div className="intro-word" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(56px,12vw,200px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)' }}>{w}</div>
          </div>
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '2rem' }}>
        Web, apps &amp; tools — designed and built end&nbsp;to&nbsp;end →
      </span>
    </div>
  )
}

export default function ProjectsReel() {
  const rowRef   = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
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
        pin: true, scrub: 1,
        anticipatePin: 1, invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    })
    setHScroll(hs)

    const words = introRef.current?.querySelectorAll('.intro-word')
    let introST: ScrollTrigger | null = null
    if (words && words.length) {
      gsap.set(words, { yPercent: 120 })
      introST = ScrollTrigger.create({
        trigger: '#projects-wrap', start: 'top 80%', once: true,
        onEnter: () => gsap.to(words, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12 }),
      })
    }

    return () => {
      hs.scrollTrigger?.kill()
      hs.kill()
      introST?.kill()
    }
  }, [])

  return (
    <div id="projects-wrap" style={{ overflow: 'hidden' }}>
      <div ref={rowRef} style={{ display: 'flex', width: 'fit-content', willChange: 'transform' }}>
        <IntroPanel introRef={introRef} />
        {FEATURED.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            hScrollRef={hScroll}
            index={i}
            isGroupStart={i === 0 || FEATURED[i - 1].group !== p.group}
          />
        ))}
      </div>
    </div>
  )
}
