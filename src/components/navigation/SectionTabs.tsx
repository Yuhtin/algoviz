'use client'
import { colors } from '@/lib/colors'

interface Tab { id: string; label: string }
interface SectionTabsProps { tabs: Tab[]; activeTab: string; onTabChange: (tabId: string) => void }

export function SectionTabs({ tabs, activeTab, onTabChange }: SectionTabsProps) {
  return (
    <div className="flex gap-0 border-b" style={{ borderColor: colors.border }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-5 py-3 text-sm font-medium transition-all relative"
            style={{ color: isActive ? colors.accent : colors.textMuted, background: 'transparent' }}
          >
            {tab.label}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: colors.accent }} />}
          </button>
        )
      })}
    </div>
  )
}
