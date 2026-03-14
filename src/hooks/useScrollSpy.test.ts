// src/hooks/useScrollSpy.test.ts
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useScrollSpy } from './useScrollSpy'

describe('useScrollSpy', () => {
  it('returns first section id by default', () => {
    const sectionIds = ['section1', 'section2', 'section3']
    const { result } = renderHook(() => useScrollSpy(sectionIds))
    expect(result.current).toBe('section1')
  })
})
