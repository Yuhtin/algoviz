'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { LessonMission as LessonMissionType } from '@/types/trail'
import { CompleteMissionButton } from './CompleteMissionButton'
import { colors } from '@/lib/colors'

interface Props {
  mission: LessonMissionType
  isCompleted: boolean
  onComplete: () => void
}

export function LessonMission({ mission, isCompleted, onComplete }: Props) {
  return (
    <div>
      <article className="prose prose-invert max-w-none" style={{ color: colors.text }}>
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const inline = !match
              return !inline ? (
                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={className}
                  style={{ backgroundColor: colors.surface, padding: '2px 6px', borderRadius: '4px' }}
                  {...props}
                >
                  {children}
                </code>
              )
            },
            h1: ({ children }) => <h1 style={{ color: colors.text }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ color: colors.text }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ color: colors.text }}>{children}</h3>,
            p: ({ children }) => <p style={{ color: colors.textMuted }}>{children}</p>,
            li: ({ children }) => <li style={{ color: colors.textMuted }}>{children}</li>,
            strong: ({ children }) => <strong style={{ color: colors.text }}>{children}</strong>,
          }}
        >
          {mission.content}
        </ReactMarkdown>
      </article>

      <div className="mt-12 pt-8 border-t" style={{ borderColor: colors.border }}>
        <CompleteMissionButton isCompleted={isCompleted} xp={mission.xp} onComplete={onComplete} />
      </div>
    </div>
  )
}
