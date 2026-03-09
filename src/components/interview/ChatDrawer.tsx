'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '@/lib/colors'
import { useChatStore } from '@/stores/chat-store'
import type { InterviewQuestion } from '@/types/interview'

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  question: InterviewQuestion | null
  algorithmSlug: string
}

export function ChatDrawer({ isOpen, onClose, question, algorithmSlug }: ChatDrawerProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { apiKey, addMessage, getConversation } = useChatStore()
  const conversation = question ? getConversation(algorithmSlug, question.id) : undefined

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !question || !apiKey || isLoading) return

    const userMessage = input.trim()
    setInput('')
    addMessage(algorithmSlug, question.id, { role: 'user', content: userMessage })
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          question,
          messages: [
            ...(conversation?.messages || []),
            { role: 'user', content: userMessage },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      addMessage(algorithmSlug, question.id, { role: 'assistant', content: data.content })
    } catch {
      addMessage(algorithmSlug, question.id, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua resposta. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
            data-testid="drawer-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ background: colors.bg }}
            data-testid="chat-drawer"
          >
            {/* Header */}
            <div
              className="p-4 flex items-center justify-between shrink-0"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <h2 className="font-semibold" style={{ color: colors.text }}>
                Pratique a Resposta
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                aria-label="Fechar"
              >
                X
              </button>
            </div>

            {/* Question */}
            {question && (
              <div
                className="p-4 shrink-0"
                style={{
                  background: colors.surface,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <p className="text-sm font-medium" style={{ color: colors.accent }}>
                  Pergunta:
                </p>
                <p className="mt-1" style={{ color: colors.text }}>
                  {question.question}
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!apiKey && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: colors.warningGlow,
                    color: colors.warning,
                  }}
                  data-testid="api-key-warning"
                >
                  Configure sua API Key da OpenAI para usar o chat.
                </div>
              )}

              {conversation?.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] p-3 rounded-lg"
                    style={{
                      background:
                        message.role === 'user' ? colors.surfaceLight : colors.surface,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                    data-testid={`message-${message.role}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      color: colors.textMuted,
                    }}
                    data-testid="loading-indicator"
                  >
                    Pensando...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 shrink-0"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua resposta..."
                  disabled={!apiKey || isLoading}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2"
                  style={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  data-testid="chat-input"
                />
                <button
                  type="submit"
                  disabled={!apiKey || isLoading || !input.trim()}
                  className="px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50"
                  style={{
                    background: colors.accent,
                    color: colors.bg,
                  }}
                  data-testid="send-button"
                >
                  Enviar
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
