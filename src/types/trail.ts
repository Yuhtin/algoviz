// src/types/trail.ts

export type MissionType = 'lesson' | 'algorithm' | 'external' | 'quiz'

export interface BaseMission {
  type: MissionType
  slug: string
  name: string
  description?: string
  xp: number
}

export interface LessonMission extends BaseMission {
  type: 'lesson'
  content: string // markdown
}

export interface AlgorithmMission extends BaseMission {
  type: 'algorithm'
  algorithmRef: string // slug do algoritmo em src/content/algorithms/
}

export interface ExternalMission extends BaseMission {
  type: 'external'
  url: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number // índice 0-based
}

export interface QuizMission extends BaseMission {
  type: 'quiz'
  xpPerQuestion: number
  perfectBonus: number
  questions: QuizQuestion[]
}

export type Mission = LessonMission | AlgorithmMission | ExternalMission | QuizMission

export type TrailDifficulty = 'Iniciante' | 'Intermediário' | 'Avançado'

export interface Trail {
  slug: string
  name: string
  description: string
  icon: string
  difficulty: TrailDifficulty
  tags: string[]
  estimatedHours: number
  missions: Mission[]
}
