// src/stores/progress-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from './progress-store'

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().reset()
  })

  it('adds XP correctly', () => {
    useProgressStore.getState().addXP(50)
    expect(useProgressStore.getState().xp).toBe(50)
  })

  it('levels up at 100 XP', () => {
    useProgressStore.getState().addXP(100)
    expect(useProgressStore.getState().level).toBe(2)
  })

  it('updates streak on activity', () => {
    useProgressStore.getState().recordActivity()
    expect(useProgressStore.getState().streak.current).toBe(1)
  })

  it('starts at level 1 with 0 XP', () => {
    expect(useProgressStore.getState().xp).toBe(0)
    expect(useProgressStore.getState().level).toBe(1)
  })

  it('accumulates XP correctly', () => {
    useProgressStore.getState().addXP(30)
    useProgressStore.getState().addXP(40)
    expect(useProgressStore.getState().xp).toBe(70)
    expect(useProgressStore.getState().level).toBe(1)
  })

  it('calculates multiple level ups', () => {
    useProgressStore.getState().addXP(250)
    expect(useProgressStore.getState().level).toBe(3)
  })

  it('updates streak best when current exceeds it', () => {
    useProgressStore.getState().recordActivity()
    expect(useProgressStore.getState().streak.best).toBe(1)
  })

  it('does not increment streak when called multiple times same day', () => {
    useProgressStore.getState().recordActivity()
    useProgressStore.getState().recordActivity()
    useProgressStore.getState().recordActivity()
    expect(useProgressStore.getState().streak.current).toBe(1)
  })

  it('adds badge correctly', () => {
    useProgressStore.getState().addBadge({
      id: 'first-algo',
      name: 'Primeiro Algoritmo',
      description: 'Completou seu primeiro algoritmo',
    })
    expect(useProgressStore.getState().badges).toHaveLength(1)
    expect(useProgressStore.getState().badges[0].id).toBe('first-algo')
  })

  it('does not add duplicate badges', () => {
    useProgressStore.getState().addBadge({
      id: 'first-algo',
      name: 'Primeiro Algoritmo',
      description: 'Completou seu primeiro algoritmo',
    })
    useProgressStore.getState().addBadge({
      id: 'first-algo',
      name: 'Primeiro Algoritmo',
      description: 'Completou seu primeiro algoritmo',
    })
    expect(useProgressStore.getState().badges).toHaveLength(1)
  })

  it('completes algorithm and adds XP', () => {
    useProgressStore.getState().completeAlgorithm('bubble-sort', 50)
    expect(useProgressStore.getState().algorithms['bubble-sort']?.completed).toBe(true)
    expect(useProgressStore.getState().xp).toBe(50)
  })

  it('does not give duplicate XP for same algorithm', () => {
    useProgressStore.getState().completeAlgorithm('bubble-sort', 50)
    useProgressStore.getState().completeAlgorithm('bubble-sort', 50)
    expect(useProgressStore.getState().xp).toBe(50)
  })

  it('resets state correctly', () => {
    useProgressStore.getState().addXP(100)
    useProgressStore.getState().recordActivity()
    useProgressStore.getState().reset()

    expect(useProgressStore.getState().xp).toBe(0)
    expect(useProgressStore.getState().level).toBe(1)
    expect(useProgressStore.getState().streak.current).toBe(0)
  })
})
