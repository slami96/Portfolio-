'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SKILL_CATEGORIES } from '@/lib/constants'

// Candidate pool for the "spin" — kept deterministic (no Math.random) so SSR
// and client render the same markup and React doesn't throw a hydration error.
const POOL = SKILL_CATEGORIES.flatMap(c => c.items)
const rotate = <T,>(arr: T[], n: number) => {
  const k = ((n % arr.length) + arr.length) % arr.length
  return arr.slice(k).concat(arr.slice(0, k))
}

const LINE = 'clamp(34px, 4vw, 52px)'

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const reels   = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.reel-strip'))
      const windows = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.reel-window'))
      const lists   = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.cat-list'))

      // distance to scroll the strip so the LAST item (the category name) lands in the window
      const land = (reel: HTMLElement) => reel.scrollHeight - (reel.parentElement?.clientHeight || 0)

      if (reduce) {
        reels.forEach(r => gsap.set(r, { y: -land(r) }))
        gsap.set(lists, { opacity: 1, y: 0 })
        return
      }

      gsap.set(lists, { opacity: 0, y: 16 })
      gsap.set(reels, { y: 0 })

      ScrollTrigger.create({
        trigger: section, start: 'top 72%', once: true,
        onEnter: () => {
          const tl = gsap.timeline()
          // each reel spins and lands, staggered (casino feel — they stop one after another)
          reels.forEach((reel, i) => {
            tl.to(reel, { y: -land(reel), duration: 1.1 + i * 0.14, ease: 'power3.out' }, 0)
          })
          // gold underline flash as they settle
          tl.fromTo(windows,
            { borderBottomColor: 'rgba(232,213,183,0)' },
            { borderBottomColor: 'rgba(232,213,183,0.5)', duration: 0.25, yoyo: true, repeat: 1 }, '>-0.15')
          // then the readable categorized lists reveal
          tl.to(lists, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '>-0.1')
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills-section" style={{ padding: '110px 7vw', background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Capabilities</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '64px' }}>
        The full stack,<br />front to back.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '48px 40px' }}>
        {SKILL_CATEGORIES.map((cat, ci) => {
          // 14 spinning candidates, then the category name as the final landing slot
          const strip = [...rotate(POOL, ci * 5 + 2).slice(0, 14), cat.name]
          return (
            <div key={cat.name}>
              <div className="reel-window" style={{ height: LINE, overflow: 'hidden', borderBottom: '1px solid rgba(232,213,183,0)', marginBottom: '22px' }}>
                <div className="reel-strip" style={{ willChange: 'transform' }}>
                  {strip.map((s, i) => {
                    const isCat = i === strip.length - 1
                    return (
                      <div key={i} style={{
                        height: LINE, display: 'flex', alignItems: 'center',
                        fontFamily: "'Syne', sans-serif", fontWeight: isCat ? 800 : 600,
                        fontSize: 'clamp(20px,2.6vw,32px)', letterSpacing: '-0.02em',
                        color: isCat ? 'var(--gold)' : 'rgba(242,240,237,0.85)', whiteSpace: 'nowrap',
                      }}>
                        {s}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="cat-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cat.items.map(it => (
                  <span key={it} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '0.04em', color: 'var(--muted)' }}>{it}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
