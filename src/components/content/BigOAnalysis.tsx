import { colors } from '@/lib/colors'

interface ComplexityItem {
  notation: string
  explanation: string
  proof?: string
}

interface BigOAnalysisProps {
  time: ComplexityItem
  space: ComplexityItem
  bestCase?: ComplexityItem
  worstCase?: ComplexityItem
}

export function BigOAnalysis({ time, space, bestCase, worstCase }: BigOAnalysisProps) {
  const items = [
    { label: 'Tempo', icon: '⏱️', ...time },
    { label: 'Espaco', icon: '💾', ...space },
    ...(bestCase ? [{ label: 'Melhor Caso', icon: '🎯', ...bestCase }] : []),
    ...(worstCase ? [{ label: 'Pior Caso', icon: '⚠️', ...worstCase }] : []),
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="p-4 rounded-lg"
          style={{ background: `${colors.visited}10`, border: `1px solid ${colors.visited}30` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>{item.icon}</span>
            <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
              {item.label}
            </span>
          </div>
          <div
            className="text-2xl font-mono font-bold mb-2"
            style={{ color: colors.visited }}
          >
            {item.notation}
          </div>
          <p className="text-sm" style={{ color: colors.text }}>
            {item.explanation}
          </p>
          {item.proof && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer" style={{ color: colors.textMuted }}>
                Ver prova
              </summary>
              <p className="mt-2 text-xs pl-2 border-l-2" style={{ borderColor: colors.border }}>
                {item.proof}
              </p>
            </details>
          )}
        </div>
      ))}
    </div>
  )
}
