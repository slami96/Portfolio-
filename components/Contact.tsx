'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Contact() {
  const emailRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    gsap.from('#contact h2', {
      opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 85%' },
    })

    // Email scramble
    const el = emailRef.current
    if (!el) return
    const original = el.textContent?.trim() || ''
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-'
    let iv: ReturnType<typeof setInterval>

    const onEnter = () => {
      let iter = 0; clearInterval(iv)
      iv = setInterval(() => {
        el.textContent = original.split('').map((c, i) => {
          if (c === ' ') return ' '
          if (i < iter) return original[i]
          return abc[Math.floor(Math.random() * abc.length)]
        }).join('')
        iter += 0.5
        if (iter >= original.length) { clearInterval(iv); el.textContent = original }
      }, 28)
    }
    const onLeave = () => { clearInterval(iv); el.textContent = original }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <section id="contact" style={{ padding: '100px 7vw 68px', background: 'var(--bg)', borderTop: '0.5px solid var(--border)' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Let&apos;s build something</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(34px,5vw,64px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: '2.5rem' }}>
        Available for<br />freelance &amp; work.
      </h2>

      {/* ★ Replace with your real email */}
      <a ref={emailRef} href="mailto:your@email.com" style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(26px,4.2vw,62px)',
        fontWeight: 700, letterSpacing: '-0.03em',
        color: 'var(--white)', textDecoration: 'none',
        display: 'inline-block', position: 'relative',
        transition: 'color 0.4s',
        borderBottom: '1.5px solid transparent',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--cream)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--white)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent' }}
      >
        your@email.com
      </a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '68px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--muted)', lineHeight: 1.8 }}>
          <div>Adam Slamen — Creative Developer &amp; UX Designer</div>
          <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.45 }}>Slovakia · Switzerland · Digital</div>
        </div>
        <div style={{ display: 'flex', gap: '22px' }}>
          {/* ★ Replace # with your real URLs */}
          {[['GitHub', '#'], ['LinkedIn', '#'], ['Instagram', '#']].map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px', color: 'var(--muted)',
              textDecoration: 'none', letterSpacing: '0.08em',
              borderBottom: '0.5px solid transparent', paddingBottom: '2px',
              transition: 'color 0.3s, border-color 0.3s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--white)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--muted)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent' }}
            >{name}</a>
          ))}
        </div>
      </div>
    </section>
  )
}
