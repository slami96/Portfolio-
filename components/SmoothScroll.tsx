'use client'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      // 0.06 was very heavy smoothing — it made scroll feel laggy/floaty and
      // disconnected from the wheel. 0.1 is crisp but still smooth.
      lerp: 0.1,
      syncTouch: false,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    // IMPORTANT: keep a single named reference to the ticker callback.
    // The old code added an arrow function and tried to remove a *different*
    // arrow function — so the loop was never removed and could stack up on
    // re-mount / hot reload, causing jagged scroll.
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
