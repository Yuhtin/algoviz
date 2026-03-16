'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './ScrollProgress'

const INITIAL_VALUES = [3, 7, 2, 9, 4, 6, 1, 8, 5]

// Pre-compute bubble sort steps
function getBubbleSortSteps(arr: number[]): number[][] {
  const steps: number[][] = [[...arr]]
  const a = [...arr]

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push([...a])
      }
    }
  }

  return steps
}

export function SortingBars() {
  const groupRef = useRef<THREE.Group>(null)
  const { sceneProgress, currentScene } = useScrollProgress()

  const steps = useMemo(() => getBubbleSortSteps(INITIAL_VALUES), [])

  // Get current values based on scroll progress within scene 1
  const currentValues = useMemo(() => {
    if (currentScene !== 1) return INITIAL_VALUES

    const stepIndex = Math.min(
      steps.length - 1,
      Math.floor(sceneProgress * steps.length)
    )
    return steps[stepIndex]
  }, [currentScene, sceneProgress, steps])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Subtle rotation
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1

    // Fade in/out based on scene
    const opacity = currentScene === 1 ? 1 : 0
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial
        material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, 0.1)
      }
    })
  })

  const barWidth = 0.4
  const spacing = 0.5
  const totalWidth = (currentValues.length - 1) * spacing

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {currentValues.map((value, index) => {
        const height = value * 0.3
        const x = index * spacing - totalWidth / 2
        const hue = (index / currentValues.length) * 0.3 + 0.45 // cyan to purple

        return (
          <mesh key={index} position={[x, height / 2, 0]}>
            <boxGeometry args={[barWidth, height, barWidth]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(hue, 0.8, 0.5)}
              transparent
              opacity={0}
              emissive={new THREE.Color().setHSL(hue, 0.8, 0.2)}
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}
