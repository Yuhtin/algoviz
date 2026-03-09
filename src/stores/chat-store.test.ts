// src/stores/chat-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from './chat-store'

describe('useChatStore', () => {
  beforeEach(() => {
    useChatStore.setState({ apiKey: null, conversations: {} })
  })

  it('sets API key', () => {
    useChatStore.getState().setApiKey('sk-test-123')
    expect(useChatStore.getState().apiKey).toBe('sk-test-123')
  })

  it('clears API key', () => {
    useChatStore.getState().setApiKey('sk-test-123')
    useChatStore.getState().setApiKey(null)
    expect(useChatStore.getState().apiKey).toBeNull()
  })

  it('adds message to conversation', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Test message' })
    const conv = useChatStore.getState().conversations['bubble-sort']?.['q1']
    expect(conv?.messages).toHaveLength(1)
    expect(conv?.messages[0].content).toBe('Test message')
  })

  it('adds message with timestamp', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Test' })
    const conv = useChatStore.getState().conversations['bubble-sort']?.['q1']
    expect(conv?.messages[0].timestamp).toBeDefined()
    expect(typeof conv?.messages[0].timestamp).toBe('number')
  })

  it('adds multiple messages to same conversation', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Hello' })
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'assistant', content: 'Hi there' })

    const conv = useChatStore.getState().conversations['bubble-sort']?.['q1']
    expect(conv?.messages).toHaveLength(2)
    expect(conv?.messages[0].role).toBe('user')
    expect(conv?.messages[1].role).toBe('assistant')
  })

  it('maintains separate conversations for different questions', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Question 1' })
    useChatStore.getState().addMessage('bubble-sort', 'q2', { role: 'user', content: 'Question 2' })

    const convQ1 = useChatStore.getState().conversations['bubble-sort']?.['q1']
    const convQ2 = useChatStore.getState().conversations['bubble-sort']?.['q2']

    expect(convQ1?.messages[0].content).toBe('Question 1')
    expect(convQ2?.messages[0].content).toBe('Question 2')
  })

  it('maintains separate conversations for different algorithms', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Bubble' })
    useChatStore.getState().addMessage('quick-sort', 'q1', { role: 'user', content: 'Quick' })

    const bubbleConv = useChatStore.getState().conversations['bubble-sort']?.['q1']
    const quickConv = useChatStore.getState().conversations['quick-sort']?.['q1']

    expect(bubbleConv?.messages[0].content).toBe('Bubble')
    expect(quickConv?.messages[0].content).toBe('Quick')
  })

  it('clears conversation', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Test' })
    useChatStore.getState().clearConversation('bubble-sort', 'q1')

    const conv = useChatStore.getState().conversations['bubble-sort']?.['q1']
    expect(conv).toBeUndefined()
  })

  it('getConversation returns conversation', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Test' })
    const conv = useChatStore.getState().getConversation('bubble-sort', 'q1')

    expect(conv).toBeDefined()
    expect(conv?.messages[0].content).toBe('Test')
  })

  it('getConversation returns undefined for non-existent conversation', () => {
    const conv = useChatStore.getState().getConversation('non-existent', 'q1')
    expect(conv).toBeUndefined()
  })

  it('sets createdAt and updatedAt timestamps', () => {
    useChatStore.getState().addMessage('bubble-sort', 'q1', { role: 'user', content: 'Test' })
    const conv = useChatStore.getState().conversations['bubble-sort']?.['q1']

    expect(conv?.createdAt).toBeDefined()
    expect(conv?.updatedAt).toBeDefined()
  })
})
