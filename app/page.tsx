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
import SocialMedia from '@/components/SocialMedia'
import MoreProjects from '@/components/MoreProjects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const handlePreloaderDone = useCallback(() => setLoading(false), [])

  useEffect(() => {
    if (loading) return
    const refresh = () => ScrollTrigger.refresh()
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
        <ProjectsReel />
        <MallysGlitch />
        <PrintRoom />
        <SocialMedia />
        <MoreProjects />
        <Skills />
        <Contact />
      </div>
    </>
  )
}
