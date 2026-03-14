'use server'

import { highlightCode, type HighlightedLine } from '@/lib/highlighter'

export async function getHighlightedCode(
  code: string,
  language: string
): Promise<HighlightedLine[]> {
  return highlightCode(code, language)
}
