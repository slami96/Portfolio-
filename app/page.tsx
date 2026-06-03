'use client'
import { useState, useCallback, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import ProjectsReel from '@/components/ProjectsReel'
import MallysGlitch from '@/components/MallysGlitch'
import PrintRoom from '@/components/PrintRoom'
import MoreProjects from '@/components/MoreProjects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const handlePreloaderDone = useCallback(() => setLoading(false), [])

  // THE FIX FOR THE OVERLAP:
  // Both the project reel and the PRINT section "pin" (lock in place while you
  // scroll). When the page first loads, each one measures where it sits. If
  // anything shifts afterwards, those measurements go stale and the pinned
  // sections overlap — which is why PRINT appeared on top of the projects.
  // Recalculating positions once everything has settled lines them up correctly.
  useEffect(() => {
    if (loading) return
    const refresh = () => ScrollTrigger.refresh()
    // wait two frames so the pinned sections have created their spacing first
    const id = requestAnimationFrame(() => requestAnimationFrame(refresh))
    window.addEventListener('load', refresh)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('load', refresh)
    }
  }, [loading])

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderDone} />}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}>
        <Nav />
        <Hero />
        <Marquee />
        {/* ProjectsReel is now imported normally (NOT lazy-loaded). Lazy-loading a
            pinned section was the root cause: it mounted late and pushed the PRINT
            section down after PRINT had already measured its position. */}
        <ProjectsReel />
        <MallysGlitch />
        <PrintRoom />
        <MoreProjects />
        <Skills />
        <Contact />
      </div>
    </>
  )
}
