// scripts/lib/code-parser.ts
export interface CodeMarker {
  line: number
  conceptId: string
}

export interface ParsedCode {
  cleanCode: string
  markers: CodeMarker[]
}

const MARKER_PATTERNS: Record<string, RegExp> = {
  python: /\s*#\s*#@([\w-]+)\s*$/,
  rust: /\s*\/\/\s*#@([\w-]+)\s*$/,
  typescript: /\s*\/\/\s*#@([\w-]+)\s*$/,
}

export function parseCodeMarkers(code: string, language: string): ParsedCode {
  const pattern = MARKER_PATTERNS[language]
  if (!pattern) {
    throw new Error(`Unsupported language: ${language}`)
  }

  const lines = code.split('\n')
  const markers: CodeMarker[] = []
  const cleanLines: string[] = []

  lines.forEach((line, index) => {
    const match = line.match(pattern)
    if (match) {
      markers.push({ line: index + 1, conceptId: match[1] })
      cleanLines.push(line.replace(pattern, ''))
    } else {
      cleanLines.push(line)
    }
  })

  return {
    cleanCode: cleanLines.join('\n'),
    markers,
  }
}
