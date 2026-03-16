'use client'

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

interface ScrollContextValue {
  progress: number // 0-1 overall
  sceneProgress: number // 0-1 within current scene
  currentScene: number // 0, 1, 2, 3
  lenis: Lenis | null
}

const ScrollContext = createContext<ScrollContextValue>({
  progress: 0,
  sceneProgress: 0,
  currentScene: 0,
  lenis: null,
})

export function useScrollProgress() {
  return useContext(ScrollContext)
}

interface Props {
  children: ReactNode
  totalScenes: number
}

export function ScrollProgressProvider({ children, totalScenes }: Props) {
  const [progress, setProgress] = useState(0)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function onScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = window.scrollY / scrollHeight
      setProgress(Math.min(1, Math.max(0, scrollProgress)))
    }

    lenis.on('scroll', onScroll)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const currentScene = Math.min(totalScenes - 1, Math.floor(progress * totalScenes))
  const sceneProgress = (progress * totalScenes) % 1

  return (
    <ScrollContext.Provider
      value={{
        progress,
        sceneProgress,
        currentScene,
        lenis: lenisRef.current,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}
