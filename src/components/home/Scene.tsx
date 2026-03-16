'use client'

import { Canvas } from '@react-three/fiber'
import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function Scene({ children }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {children}
    </Canvas>
  )
}
