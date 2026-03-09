// src/types/interview.ts

export interface RubricItem {
  id: string
  point: string
  required: boolean
}

export interface InterviewQuestion {
  id: string
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  companies?: string[]
  tip?: string
  followUp?: string
  rubric: RubricItem[]
  idealAnswer: string
}

export interface InterviewData {
  questions: InterviewQuestion[]
}
