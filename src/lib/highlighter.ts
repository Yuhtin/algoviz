import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki'

let highlighter: Highlighter | null = null

const SUPPORTED_LANGUAGES: BundledLanguage[] = ['python', 'rust', 'typescript', 'javascript']

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['one-dark-pro'],
      langs: SUPPORTED_LANGUAGES,
    })
  }
  return highlighter
}

export interface HighlightedLine {
  lineNumber: number
  html: string
}

export async function highlightCode(
  code: string,
  language: string
): Promise<HighlightedLine[]> {
  const hl = await getHighlighter()

  const lang = SUPPORTED_LANGUAGES.includes(language as BundledLanguage)
    ? (language as BundledLanguage)
    : 'typescript'

  // Split code into lines and highlight each line individually
  const lines = code.split('\n')

  const result: HighlightedLine[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim() === '') {
      // Empty line
      result.push({ lineNumber: i + 1, html: '&nbsp;' })
    } else {
      // Highlight single line
      const html = hl.codeToHtml(line, {
        lang,
        theme: 'one-dark-pro',
      })

      // Extract just the content inside <code>...</code>
      // Shiki generates: <pre ...><code>...tokens...</code></pre>
      const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
      const innerHtml = codeMatch ? codeMatch[1] : line

      // Remove the outer <span class="line"> wrapper if present
      const cleanHtml = innerHtml
        .replace(/^<span class="line"[^>]*>/, '')
        .replace(/<\/span>$/, '')

      result.push({ lineNumber: i + 1, html: cleanHtml || '&nbsp;' })
    }
  }

  return result
}

export type { BundledLanguage }
