'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export function useScrollSpy(sectionIds: string[], options?: { updateUrl?: boolean }) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')
  const lastUpdateRef = useRef<string>('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateUrl = useCallback((id: string) => {
    if (options?.updateUrl && lastUpdateRef.current !== id) {
      // Debounce URL updates to prevent flickering
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        lastUpdateRef.current = id
        const url = new URL(window.location.href)
        url.searchParams.set('section', id)
        window.history.replaceState(null, '', url.toString())
      }, 150)
    }
  }, [options?.updateUrl])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
              updateUrl(id)
            }
          })
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [sectionIds, updateUrl])

  return activeSection
}
