'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Inline SVG icons — no extra library needed. They inherit `currentColor`,
// so the hover colour change below "just works".
const ICONS: Record<string, React.ReactNode> = {
  GitHub: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07zM12 6.85a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.49a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68zm5.34-8.69a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
    </svg>
  ),
}

// ★ Replace # with your real profile URLs
const SOCIALS: { name: keyof typeof ICONS; url: string }[] = [
  { name: 'GitHub',    url: '#' },
  { name: 'LinkedIn',  url: '#' },
  { name: 'Instagram', url: '#' },
]

export default function Contact() {
  const emailRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    gsap.from('#contact h2', {
      opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 85%' },
    })

    // Email scramble on hover
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
      <a ref={emailRef} href="mailto:adam.slamen@gmail.com" style={{
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
        adam.slamen@gmail.com
      </a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '68px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--muted)', lineHeight: 1.8 }}>
          <div>Adam Slamen — Creative Developer &amp; UX Designer</div>
          <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.45 }}>Slovakia · Switzerland · Digital</div>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          {SOCIALS.map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              style={{
                color: 'var(--muted)',
                display: 'inline-flex',
                transition: 'color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              {ICONS[name]}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
