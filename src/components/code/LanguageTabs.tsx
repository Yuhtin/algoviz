'use client'
import { colors } from '@/lib/colors'

type Language = 'python' | 'rust' | 'typescript'
const languageLabels: Record<Language, string> = { python: 'Python', rust: 'Rust', typescript: 'TypeScript' }
const languageIcons: Record<Language, string> = { python: '🐍', rust: '🦀', typescript: '📘' }

interface LanguageTabsProps { languages: Language[]; active: Language; onChange: (lang: Language) => void }

export function LanguageTabs({ languages, active, onChange }: LanguageTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ background: colors.surface }}>
      {languages.map((lang) => {
        const isActive = active === lang
        return (
          <button key={lang} onClick={() => onChange(lang)} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ background: isActive ? colors.surfaceLight : 'transparent', color: isActive ? colors.accent : colors.textMuted }}>
            <span>{languageIcons[lang]}</span>{languageLabels[lang]}
          </button>
        )
      })}
    </div>
  )
}
