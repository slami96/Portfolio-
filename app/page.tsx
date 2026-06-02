'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import MallysGlitch from '@/components/MallysGlitch'
import PrintRoom from '@/components/PrintRoom'
import MoreProjects from '@/components/MoreProjects'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

// ProjectsReel uses ScrollTrigger pinning — client only
const ProjectsReel = dynamic(() => import('@/components/ProjectsReel'), { ssr: false })

export default function Page() {
  const [loading, setLoading] = useState(true)
  const handlePreloaderDone = useCallback(() => setLoading(false), [])

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
        <MoreProjects />
        <Skills />
        <Contact />
      </div>
    </>
  )
}
