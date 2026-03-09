// src/hooks/useScrollSpy.test.ts
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useScrollSpy } from './useScrollSpy'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('useScrollSpy', () => {
  it('returns first section id by default', () => {
    const sectionIds = ['section1', 'section2', 'section3']
    const { result } = renderHook(() => useScrollSpy(sectionIds))
    expect(result.current).toBe('section1')
  })
})
