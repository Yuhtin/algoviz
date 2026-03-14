'use client'

import { colors } from '@/lib/colors'

export interface TocSection {
  id: string
  label: string
  level?: number
}

interface TableOfContentsProps {
  sections: TocSection[]
  activeSection: string
  onNavigate?: (sectionId: string) => void
}

export function TableOfContents({ sections, activeSection, onNavigate }: TableOfContentsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      onNavigate?.(sectionId)
    }
  }

  return (
    <nav className="sticky top-24 w-48 hidden lg:block self-start h-fit">
      <div className="text-xs uppercase tracking-widest mb-4" style={{ color: colors.textMuted }}>
        Nesta pagina
      </div>
      <ul className="space-y-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-active={isActive}
                onClick={(e) => handleClick(e, section.id)}
                className="block text-sm py-1 transition-colors border-l-2 pl-3"
                style={{
                  color: isActive ? colors.accent : colors.textMuted,
                  borderColor: isActive ? colors.accent : 'transparent',
                  marginLeft: section.level ? `${section.level * 8}px` : undefined,
                }}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
