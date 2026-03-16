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

export interface QuizResult {
  answers: number[]
  score: number
  perfectScore: boolean
  xpEarned: number
  completedAt: number
}

export interface TrailProgress {
  startedAt: number
  completedMissions: string[]
  quizResults: Record<string, QuizResult>
}

interface ProgressState {
  xp: number
  level: number
  streak: Streak
  badges: Badge[]
  algorithms: Record<string, AlgorithmProgress>
  trails: Record<string, TrailProgress>

  addXP: (amount: number) => void
  recordActivity: () => void
  addBadge: (badge: Omit<Badge, 'earnedAt'>) => void
  completeAlgorithm: (slug: string, xpEarned: number) => void
  startTrail: (trailSlug: string) => void
  completeMission: (trailSlug: string, missionSlug: string, xpAmount: number) => void
  saveQuizResult: (trailSlug: string, missionSlug: string, result: Omit<QuizResult, 'completedAt'>) => void
  isTrailStarted: (trailSlug: string) => boolean
  isMissionCompleted: (trailSlug: string, missionSlug: string) => boolean
  getCompletedMissionsCount: (trailSlug: string) => number
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
  trails: {},
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

      startTrail: (trailSlug) =>
        set((state) => {
          if (state.trails[trailSlug]) return state
          return {
            trails: {
              ...state.trails,
              [trailSlug]: {
                startedAt: Date.now(),
                completedMissions: [],
                quizResults: {},
              },
            },
          }
        }),

      completeMission: (trailSlug, missionSlug, xpAmount) =>
        set((state) => {
          const trail = state.trails[trailSlug] || {
            startedAt: Date.now(),
            completedMissions: [],
            quizResults: {},
          }

          if (trail.completedMissions.includes(missionSlug)) {
            return state // Already completed
          }

          const newXp = state.xp + xpAmount
          return {
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            trails: {
              ...state.trails,
              [trailSlug]: {
                ...trail,
                completedMissions: [...trail.completedMissions, missionSlug],
              },
            },
          }
        }),

      saveQuizResult: (trailSlug, missionSlug, result) =>
        set((state) => {
          const trail = state.trails[trailSlug]
          if (!trail) return state

          return {
            trails: {
              ...state.trails,
              [trailSlug]: {
                ...trail,
                quizResults: {
                  ...trail.quizResults,
                  [missionSlug]: {
                    ...result,
                    completedAt: Date.now(),
                  },
                },
              },
            },
          }
        }),

      isTrailStarted: (trailSlug) => !!get().trails[trailSlug],

      isMissionCompleted: (trailSlug, missionSlug) => {
        const trail = get().trails[trailSlug]
        return trail?.completedMissions.includes(missionSlug) ?? false
      },

      getCompletedMissionsCount: (trailSlug) => {
        const trail = get().trails[trailSlug]
        return trail?.completedMissions.length ?? 0
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
        trails: state.trails,
      }),
    }
  )
)
