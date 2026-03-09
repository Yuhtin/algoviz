// src/stores/chat-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface Conversation {
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

interface ChatState {
  apiKey: string | null
  conversations: Record<string, Record<string, Conversation>>

  setApiKey: (key: string | null) => void
  addMessage: (
    algorithmSlug: string,
    questionId: string,
    message: Omit<ChatMessage, 'timestamp'>
  ) => void
  clearConversation: (algorithmSlug: string, questionId: string) => void
  getConversation: (
    algorithmSlug: string,
    questionId: string
  ) => Conversation | undefined
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      conversations: {},

      setApiKey: (key) => set({ apiKey: key }),

      addMessage: (algorithmSlug, questionId, message) => {
        const now = Date.now()
        const messageWithTimestamp: ChatMessage = {
          ...message,
          timestamp: now,
        }

        set((state) => {
          const algorithmConvs = state.conversations[algorithmSlug] ?? {}
          const conversation = algorithmConvs[questionId] ?? {
            messages: [],
            createdAt: now,
            updatedAt: now,
          }

          return {
            conversations: {
              ...state.conversations,
              [algorithmSlug]: {
                ...algorithmConvs,
                [questionId]: {
                  ...conversation,
                  messages: [...conversation.messages, messageWithTimestamp],
                  updatedAt: now,
                },
              },
            },
          }
        })
      },

      clearConversation: (algorithmSlug, questionId) => {
        set((state) => {
          const algorithmConvs = { ...state.conversations[algorithmSlug] }
          delete algorithmConvs[questionId]

          return {
            conversations: {
              ...state.conversations,
              [algorithmSlug]: algorithmConvs,
            },
          }
        })
      },

      getConversation: (algorithmSlug, questionId) => {
        return get().conversations[algorithmSlug]?.[questionId]
      },
    }),
    {
      name: 'algoviz-chat-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        conversations: state.conversations,
      }),
    }
  )
)
