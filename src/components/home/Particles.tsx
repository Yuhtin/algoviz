'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './ScrollProgress'

interface Props {
  count?: number
}

export function Particles({ count = 500 }: Props) {
  const mesh = useRef<THREE.Points>(null)
  const { progress } = useScrollProgress()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color('#00d4aa'), // accent
      new THREE.Color('#6c5ce7'), // visited
      new THREE.Color('#ff6b6b'), // warning
      new THREE.Color('#ffc107'), // yellow
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    // Rotate slowly
    mesh.current.rotation.x = time * 0.05
    mesh.current.rotation.y = time * 0.08

    // Move based on scroll
    mesh.current.position.z = -progress * 5

    // Pulse size based on scroll
    const material = mesh.current.material as THREE.PointsMaterial
    material.size = 0.05 + Math.sin(time * 2) * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
