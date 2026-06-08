'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Portrait story screenshots (~9:19.5). Add them to /public/stories/ later.
const STORIES = [
  '/stories/story1.jpg',
  '/stories/story2.jpg',
  '/stories/story3.jpg',
  '/stories/story4.jpg',
  '/stories/story5.jpg',
]

const DETAILS: [string, string][] = [
  ['The work', 'Vertical-first content for Instagram & TikTok — story sets, reel covers and campaign creative designed to feel native to the feed, not bolted on.'],
  ['The approach', 'The brand’s motion, type and colour carried straight from web into social, so every touchpoint reads as one identity.'],
  ['Formats', 'Story sequences, reel covers, carousels and launch teasers — built to publish and built to stop the scroll.'],
]

// Phone frame (matches the reel’s iPhone aesthetic)
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative', height: 'min(66vh, 560px)', aspectRatio: '9 / 19.5',
      background: '#0b0b0b', borderRadius: 38, padding: 8,
      boxShadow: '0 50px 110px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)',
    }}>
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 74, height: 21, background: '#000', borderRadius: 12, zIndex: 4 }} />
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', background: '#0f0f12' }}>
        {children}
      </div>
    </div>
  )
}

export default function SocialMedia() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const eyebrowRef   = useRef<HTMLDivElement>(null)
  const moveRef      = useRef<HTMLDivElement>(null)   // outer: centres + slides right
  const riseRef      = useRef<HTMLDivElement>(null)   // inner: entrance + final scale
  const textRef      = useRef<HTMLDivElement>(null)
  const storyRefs    = useRef<(HTMLDivElement | null)[]>([])

  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isDesktop || !sectionRef.current) return

    const SCROLL_DIST = window.innerHeight * 7

    const ctx = gsap.context(() => {
      const title = titleRef.current!
      title.innerHTML = title.textContent!.trim().split('').map(c =>
        `<span style="display:inline-block;overflow:hidden"><span class="sch" style="display:inline-block">${c}</span></span>`
      ).join('')

      const stories = storyRefs.current.filter(Boolean) as HTMLDivElement[]

      // base: phone centred via the outer wrapper; first story visible, rest hidden
      gsap.set(moveRef.current, { xPercent: -50, yPercent: -50 })
      gsap.set(stories.slice(1), { opacity: 0 })

      const tl = gsap.timeline()
      tl
        // 1 — SOCIAL slams in, holds, clears
        .from(title.querySelectorAll('.sch'), { yPercent: 120, opacity: 0, stagger: 0.05, duration: 1, ease: 'power4.out' }, 0)
        .to(titleWrapRef.current, { duration: 1 }, 1.5)
        .to(titleWrapRef.current, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, 2.3)
        .to(eyebrowRef.current, { opacity: 1, duration: 0.8 }, 2.8)
        // 2 — phone rises in (story 1 showing)
        .fromTo(riseRef.current,
          { y: 130, rotateX: 24, scale: 0.8, opacity: 0, transformPerspective: 1200 },
          { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }, 3.0)
        .to({}, { duration: 1 }, 5.0)                              // hold story 1
        // 3 — scrub through the rest of the stories (cross-fades)
        .to(stories[0], { opacity: 0, duration: 0.8 }, 6.0)
        .fromTo(stories[1], { opacity: 0 }, { opacity: 1, duration: 0.8 }, 6.0)
        .to({}, { duration: 1 }, 6.8)
        .to(stories[1], { opacity: 0, duration: 0.8 }, 7.8)
        .fromTo(stories[2], { opacity: 0 }, { opacity: 1, duration: 0.8 }, 7.8)
        .to({}, { duration: 1 }, 8.6)
        .to(stories[2], { opacity: 0, duration: 0.8 }, 9.6)
        .fromTo(stories[3], { opacity: 0 }, { opacity: 1, duration: 0.8 }, 9.6)
        .to({}, { duration: 1 }, 10.4)
        .to(stories[3], { opacity: 0, duration: 0.8 }, 11.4)
        .fromTo(stories[4], { opacity: 0 }, { opacity: 1, duration: 0.8 }, 11.4)
        .to({}, { duration: 1.2 }, 12.2)                           // hold story 5
        // 4 — phone slides right + shrinks slightly; text reveals on the left
        .to(moveRef.current, { x: () => window.innerWidth * 0.22, duration: 1.5, ease: 'power3.inOut' }, 13.4)
        .to(riseRef.current, { scale: 0.94, duration: 1.5, ease: 'power3.inOut' }, 13.4)
        .fromTo(textRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, ease: 'power2.out' }, 13.7)
        .to({}, { duration: 1 }, 15.0)                             // hold final composition

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${SCROLL_DIST}`,
        pin: true, pinSpacing: true, anticipatePin: 1,
        scrub: 1, invalidateOnRefresh: true, refreshPriority: 1,
        animation: tl,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  // Story image with graceful placeholder (hidden once the real image loads)
  const story = (src: string, i: number) => (
    <div
      key={src}
      ref={el => { storyRefs.current[i] = el }}
      style={{ position: 'absolute', inset: 0, willChange: 'opacity' }}
    >
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(160deg,#16121c,#0f0f14)' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: 'rgba(255,255,255,0.55)' }}>Story {i + 1}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)' }}>SOCIAL CONTENT</div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Social story ${i + 1}`}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        onLoad={() => ScrollTrigger.refresh()}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
      />
    </div>
  )

  const textBlock = (
    <>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Social · Content Creation</span>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px,3.4vw,52px)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--white)', lineHeight: 1.08, marginBottom: '2rem' }}>
        Content that<br />earns the scroll.
      </h3>
      <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: '2rem' }} />
      {DETAILS.map(([l, t]) => (
        <div key={l} style={{ marginBottom: '1.8rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>{l}</div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{t}</p>
        </div>
      ))}
    </>
  )

  // ── MOBILE: simple stacked layout ──
  if (!isDesktop) {
    return (
      <section style={{ background: 'var(--bg)', borderTop: '0.5px solid var(--border)', padding: '72px 7vw 80px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Social Media</span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px,16vw,80px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 1, margin: '12px 0 36px' }}>SOCIAL</h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <PhoneFrame>{story(STORIES[0], 0)}</PhoneFrame>
        </div>

        <div>{textBlock}</div>
      </section>
    )
  }

  // ── DESKTOP: pinned, scroll-driven film ──
  return (
    <section ref={sectionRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      {/* eyebrow, top-left */}
      <div ref={eyebrowRef} style={{ position: 'absolute', top: '36px', left: '7vw', zIndex: 6, opacity: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Social · Content Creation</span>
      </div>

      {/* Text block — left side, revealed at the end */}
      <div ref={textRef} style={{ position: 'absolute', left: '7vw', top: '50%', transform: 'translateY(-50%)', width: '38%', maxWidth: 520, zIndex: 3, opacity: 0 }}>
        {textBlock}
      </div>

      {/* Phone — centred, then slides right */}
      <div ref={moveRef} style={{ position: 'absolute', left: '50%', top: '50%', zIndex: 2 }}>
        <div ref={riseRef} style={{ willChange: 'transform, opacity' }}>
          <PhoneFrame>
            {STORIES.map((src, i) => story(src, i))}
          </PhoneFrame>
        </div>
      </div>

      {/* TITLE overlay */}
      <div ref={titleWrapRef} style={{ position: 'absolute', inset: 0, zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', background: 'var(--bg)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.4rem' }}>Social · Content Creation</span>
        <h2 ref={titleRef} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(70px,15vw,240px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--white)', lineHeight: 0.9 }}>SOCIAL</h2>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '1.4rem' }}>Scroll to reveal the content ↓</span>
      </div>
    </section>
  )
}
