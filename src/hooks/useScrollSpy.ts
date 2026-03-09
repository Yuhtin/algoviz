'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useScrollSpy(sectionIds: string[], options?: { updateUrl?: boolean }) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')
  const router = useRouter()
  const searchParams = useSearchParams()

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
              if (options?.updateUrl) {
                const newParams = new URLSearchParams(searchParams.toString())
                newParams.set('section', id)
                router.replace(`?${newParams.toString()}`, { scroll: false })
              }
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
    }
  }, [sectionIds, options?.updateUrl, router, searchParams])

  return activeSection
}
