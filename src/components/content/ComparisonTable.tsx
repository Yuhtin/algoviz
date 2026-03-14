import { colors } from '@/lib/colors'

interface AlgorithmComparison {
  name: string
  slug?: string
  time: string
  space: string
  stable?: boolean
  bestFor?: string
}

interface ComparisonTableProps {
  algorithms: AlgorithmComparison[]
  currentSlug: string
  title?: string
}

export function ComparisonTable({ algorithms, currentSlug, title }: ComparisonTableProps) {
  // Only show "Estavel" column if at least one algorithm has stable defined
  const showStableColumn = algorithms.some((algo) => algo.stable !== undefined)

  return (
    <div className="my-4 overflow-x-auto">
      {title && (
        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
          {title}
        </h3>
      )}
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
            <th className="text-left py-2 px-3" style={{ color: colors.textMuted }}>Algoritmo</th>
            <th className="text-left py-2 px-3" style={{ color: colors.textMuted }}>Tempo</th>
            <th className="text-left py-2 px-3" style={{ color: colors.textMuted }}>Espaco</th>
            {showStableColumn && (
              <th className="text-left py-2 px-3" style={{ color: colors.textMuted }}>Estavel</th>
            )}
            <th className="text-left py-2 px-3" style={{ color: colors.textMuted }}>Melhor Para</th>
          </tr>
        </thead>
        <tbody>
          {algorithms.map((algo) => {
            const isCurrent = algo.slug === currentSlug || algo.name.toLowerCase().replace(' ', '-') === currentSlug
            return (
              <tr
                key={algo.name}
                data-current={isCurrent}
                style={{
                  background: isCurrent ? `${colors.accent}10` : 'transparent',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <td className="py-2 px-3 font-medium" style={{ color: isCurrent ? colors.accent : colors.text }}>
                  {algo.name}
                  {isCurrent && <span className="ml-2 text-xs">(atual)</span>}
                </td>
                <td className="py-2 px-3 font-mono" style={{ color: colors.visited }}>{algo.time}</td>
                <td className="py-2 px-3 font-mono" style={{ color: colors.visited }}>{algo.space}</td>
                {showStableColumn && (
                  <td className="py-2 px-3" style={{ color: algo.stable ? colors.accent : colors.warning }}>
                    {algo.stable === undefined ? '-' : algo.stable ? 'Sim' : 'Nao'}
                  </td>
                )}
                <td className="py-2 px-3" style={{ color: colors.textMuted }}>{algo.bestFor || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
