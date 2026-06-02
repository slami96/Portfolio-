'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const N = 120
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

    const lineMat = new THREE.LineBasicMaterial({ color: 0xE8D5B7, transparent: true, opacity: 0.06 })
    let lineMesh: THREE.LineSegments | null = null

    function buildLines() {
      const p = geo.attributes.position.array as Float32Array
      const verts: number[] = []
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = p[i*3]-p[j*3], dy = p[i*3+1]-p[j*3+1], dz = p[i*3+2]-p[j*3+2]
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 2.8) {
            verts.push(p[i*3],p[i*3+1],p[i*3+2],p[j*3],p[j*3+1],p[j*3+2])
          }
        }
      }
      if (lineMesh) scene.remove(lineMesh)
      const lg = new THREE.BufferGeometry()
      lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
      lineMesh = new THREE.LineSegments(lg, lineMat)
      scene.add(lineMesh)
    }
    buildLines()

    let mx = 0, my = 0
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 0.4
      my = -(e.clientY / window.innerHeight - 0.5) * 0.4
    }
    document.addEventListener('mousemove', onMouseMove)

    let frame = 0
    let animId: number
    function animate() {
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
      if (frame % 3 === 0) buildLines()
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.02
      camera.position.y += (my * 0.3 - camera.position.y) * 0.02
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
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
