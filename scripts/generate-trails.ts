// scripts/generate-trails.ts
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const TRAILS_DIR = path.join(process.cwd(), 'src/content/trails')
const OUTPUT_DIR = path.join(process.cwd(), 'src/generated/trails')

interface RawTrail {
  slug: string
  name: string
  description: string
  icon: string
  difficulty: string
  tags: string[]
  estimatedHours: number
  missions: string[]
}

interface RawMission {
  type: string
  slug: string
  name: string
  description?: string
  xp?: number
  content?: string
  algorithmRef?: string
  url?: string
  xpPerQuestion?: number
  perfectBonus?: number
  questions?: Array<{
    question: string
    options: string[]
    correct: number
  }>
}

function loadYaml<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8')
  return yaml.load(content) as T
}

function generateTrail(trailDir: string): void {
  const trailPath = path.join(trailDir, 'trail.yml')
  const missionsDir = path.join(trailDir, 'missions')

  if (!fs.existsSync(trailPath)) {
    console.warn(`Skipping ${trailDir}: no trail.yml found`)
    return
  }

  const rawTrail = loadYaml<RawTrail>(trailPath)
  const missions: RawMission[] = []

  // Load each mission in order
  for (const missionSlug of rawTrail.missions) {
    const missionPath = path.join(missionsDir, `${missionSlug}.yml`)
    if (fs.existsSync(missionPath)) {
      const mission = loadYaml<RawMission>(missionPath)
      missions.push(mission)
    } else {
      console.warn(`Mission not found: ${missionPath}`)
    }
  }

  // Generate TypeScript output
  const output = `// Auto-generated from ${rawTrail.slug}/trail.yml
// Do not edit manually

import type { Trail } from '@/types/trail'

export const ${toCamelCase(rawTrail.slug)}Trail: Trail = ${JSON.stringify(
    {
      ...rawTrail,
      missions,
    },
    null,
    2
  )}
`

  const outputPath = path.join(OUTPUT_DIR, `${rawTrail.slug}.ts`)
  fs.writeFileSync(outputPath, output)
  console.log(`Generated: ${outputPath}`)
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Process each trail directory
  const trailDirs = fs.readdirSync(TRAILS_DIR).filter((dir) => {
    const fullPath = path.join(TRAILS_DIR, dir)
    return fs.statSync(fullPath).isDirectory()
  })

  for (const dir of trailDirs) {
    generateTrail(path.join(TRAILS_DIR, dir))
  }

  // Generate index file
  const indexContent = trailDirs
    .map((dir) => `export { ${toCamelCase(dir)}Trail } from './${dir}'`)
    .join('\n')

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent + '\n')
  console.log(`Generated: ${OUTPUT_DIR}/index.ts`)
}

main()
