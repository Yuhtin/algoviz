import { colors } from '@/lib/colors'

interface PullQuoteProps {
  children: React.ReactNode
}

export function PullQuote({ children }: PullQuoteProps) {
  return (
    <blockquote
      role="blockquote"
      className="my-8 py-4 px-6 text-lg italic border-l-4 rounded-r"
      style={{
        borderColor: colors.accent,
        background: colors.surface,
        color: colors.text,
      }}
    >
      &ldquo;{children}&rdquo;
    </blockquote>
  )
}
