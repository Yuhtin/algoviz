import { NextRequest, NextResponse } from 'next/server'
import type { InterviewQuestion } from '@/types/interview'
import type { ChatMessage } from '@/stores/chat-store'

interface ChatRequestBody {
  apiKey: string
  question: InterviewQuestion
  messages: ChatMessage[]
}

function buildSystemPrompt(question: InterviewQuestion): string {
  const rubricPoints = question.rubric
    .map((item) => `- ${item.point}${item.required ? ' (obrigatorio)' : ''}`)
    .join('\n')

  return `Voce e um entrevistador tecnico especializado em algoritmos e estruturas de dados.
Voce esta avaliando a resposta do candidato para a seguinte pergunta de entrevista.

PERGUNTA: ${question.question}

RESPOSTA IDEAL:
${question.idealAnswer}

RUBRICA DE AVALIACAO:
${rubricPoints || 'Avalie com base na resposta ideal.'}

INSTRUCOES:
1. Avalie a resposta do candidato de forma construtiva
2. Aponte o que foi bem explicado e o que pode melhorar
3. Se a resposta estiver incompleta, faca perguntas de acompanhamento para guiar o candidato
4. Seja encorajador mas honesto sobre gaps no conhecimento
5. Use portugues do Brasil em suas respostas
6. Seja conciso mas informativo`
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json()
    const { apiKey, question, messages } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt(question)

    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to get response from OpenAI' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
