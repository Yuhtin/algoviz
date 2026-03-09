// src/stores/progress-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Streak {
  current: number
  best: number
  lastDate: string | null
}

export interface AlgorithmProgress {
  completed: boolean
  completedAt: number | null
  xpEarned: number
}

export interface Badge {
  id: string
  name: string
  description: string
  earnedAt: number
}

interface ProgressState {
  xp: number
  level: number
  streak: Streak
  badges: Badge[]
  algorithms: Record<string, AlgorithmProgress>

  addXP: (amount: number) => void
  recordActivity: () => void
  addBadge: (badge: Omit<Badge, 'earnedAt'>) => void
  completeAlgorithm: (slug: string, xpEarned: number) => void
  reset: () => void
}

const XP_PER_LEVEL = 100

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDateString(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

const initialState = {
  xp: 0,
  level: 1,
  streak: {
    current: 0,
    best: 0,
    lastDate: null,
  },
  badges: [],
  algorithms: {},
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount
          const newLevel = calculateLevel(newXP)
          return {
            xp: newXP,
            level: newLevel,
          }
        })
      },

      recordActivity: () => {
        set((state) => {
          const today = getTodayDateString()
          const yesterday = getYesterdayDateString()

          // Already recorded today
          if (state.streak.lastDate === today) {
            return state
          }

          let newCurrent: number

          if (state.streak.lastDate === yesterday) {
            // Continuing streak
            newCurrent = state.streak.current + 1
          } else {
            // Starting new streak
            newCurrent = 1
          }

          const newBest = Math.max(newCurrent, state.streak.best)

          return {
            streak: {
              current: newCurrent,
              best: newBest,
              lastDate: today,
            },
          }
        })
      },

      addBadge: (badge) => {
        set((state) => {
          // Don't add duplicate badges
          if (state.badges.some((b) => b.id === badge.id)) {
            return state
          }

          return {
            badges: [
              ...state.badges,
              {
                ...badge,
                earnedAt: Date.now(),
              },
            ],
          }
        })
      },

      completeAlgorithm: (slug, xpEarned) => {
        const state = get()

        // Already completed
        if (state.algorithms[slug]?.completed) {
          return
        }

        set((state) => ({
          algorithms: {
            ...state.algorithms,
            [slug]: {
              completed: true,
              completedAt: Date.now(),
              xpEarned,
            },
          },
        }))

        // Also add XP
        get().addXP(xpEarned)
      },

      reset: () => set(initialState),
    }),
    {
      name: 'algoviz-progress-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        badges: state.badges,
        algorithms: state.algorithms,
      }),
    }
  )
)
