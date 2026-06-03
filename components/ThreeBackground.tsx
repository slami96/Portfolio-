'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // 120 -> 90 particles. The line cost grows with the square of this number,
    // so a small drop here is a big saving with almost no visual difference.
    const N = 90
    const pos = new Float32Array(N * 3)
    const vel: { x: number; y: number }[] = []
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel.push({ x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003 })
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xE8D5B7, size: 0.035, transparent: true, opacity: 0.5 })
    scene.add(new THREE.Points(geo, mat))

    // KEY FIX: allocate the line buffer ONCE at the maximum possible size and
    // reuse it. The old code threw away and rebuilt a whole geometry every few
    // frames, which churned memory and caused frame drops. Now we only update
    // the numbers inside the existing buffer.
    const maxSegments = (N * (N - 1)) / 2
    const linePositions = new Float32Array(maxSegments * 2 * 3)
    const lineGeo = new THREE.BufferGeometry()
    const lineAttr = new THREE.BufferAttribute(linePositions, 3)
    lineAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', lineAttr)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xE8D5B7, transparent: true, opacity: 0.06 })
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineMesh)

    const CONNECT_DIST_SQ = 2.8 * 2.8

    function rebuildLines() {
      const p = geo.attributes.position.array as Float32Array
      let v = 0
      for (let i = 0; i < N; i++) {
        const ix = p[i*3], iy = p[i*3+1], iz = p[i*3+2]
        for (let j = i + 1; j < N; j++) {
          const dx = ix - p[j*3], dy = iy - p[j*3+1], dz = iz - p[j*3+2]
          // Compare squared distances — avoids a Math.sqrt on every pair.
          if (dx*dx + dy*dy + dz*dz < CONNECT_DIST_SQ) {
            linePositions[v++] = ix;       linePositions[v++] = iy;       linePositions[v++] = iz
            linePositions[v++] = p[j*3];   linePositions[v++] = p[j*3+1]; linePositions[v++] = p[j*3+2]
          }
        }
      }
      lineGeo.setDrawRange(0, v / 3)
      lineAttr.needsUpdate = true
    }
    rebuildLines()

    let mx = 0, my = 0
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.4
      my = -(e.clientY / window.innerHeight - 0.5) * 0.4
    }
    document.addEventListener('mousemove', onMouseMove)

    let frame = 0
    let animId = 0
    let running = true

    function animate() {
      if (!running) return
      animId = requestAnimationFrame(animate)
      frame++
      const p = geo.attributes.position.array as Float32Array
      for (let i = 0; i < N; i++) {
        p[i*3]     += vel[i].x + mx * 0.001
        p[i*3 + 1] += vel[i].y + my * 0.001
        if (p[i*3] > 7 || p[i*3] < -7)     vel[i].x *= -1
        if (p[i*3+1] > 4 || p[i*3+1] < -4) vel[i].y *= -1
      }
      geo.attributes.position.needsUpdate = true
      if (frame % 6 === 0) rebuildLines()   // was every 3rd frame
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.02
      camera.position.y += (my * 0.3 - camera.position.y) * 0.02
      renderer.render(scene, camera)
    }

    if (reduceMotion) {
      renderer.render(scene, camera) // draw one static frame, no loop
    } else {
      animate()
    }

    // Pause the whole loop when the tab is in the background.
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(animId)
      } else if (!reduceMotion && !running) {
        running = true
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      running = false
      cancelAnimationFrame(animId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      lineGeo.dispose()
      mat.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0, opacity: 0.55, pointerEvents: 'none',
    }} />
  )
}
