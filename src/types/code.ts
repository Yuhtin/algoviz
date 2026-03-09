export interface CodeAnnotation {
  lineStart: number
  lineEnd: number
  conceptId: string
  conceptLabel: string
  explanation: string
}

export interface CodeFile {
  language: 'python' | 'rust' | 'typescript'
  code: string
  annotations: CodeAnnotation[]
}
