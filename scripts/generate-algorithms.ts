// scripts/generate-algorithms.ts
import * as fs from 'fs'
import * as path from 'path'
import { parseAlgorithmYaml, validateYaml } from './lib/yaml-parser'
import { parseCodeMarkers } from './lib/code-parser'
import { generateAlgorithmFile, generateIndexFile } from './lib/generator'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/algorithms')
const OUTPUT_DIR = path.join(process.cwd(), 'src/generated/algorithms')

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function processAlgorithm(slug: string): void {
  const algoDir = path.join(CONTENT_DIR, slug)

  // Read files
  const yamlPath = path.join(algoDir, 'algorithm.yml')
  const pythonPath = path.join(algoDir, 'code.py')
  const rustPath = path.join(algoDir, 'code.rs')

  if (!fs.existsSync(yamlPath)) {
    throw new Error(`Missing algorithm.yml in ${slug}`)
  }

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
  const yaml = parseAlgorithmYaml(yamlContent)
  validateYaml(yaml)

  // Parse code files (optional - may not exist yet)
  let pythonCode = ''
  let pythonMarkers: { line: number; conceptId: string }[] = []
  if (fs.existsSync(pythonPath)) {
    const rawPython = fs.readFileSync(pythonPath, 'utf-8')
    const parsed = parseCodeMarkers(rawPython, 'python')
    pythonCode = parsed.cleanCode
    pythonMarkers = parsed.markers
  }

  let rustCode = ''
  let rustMarkers: { line: number; conceptId: string }[] = []
  if (fs.existsSync(rustPath)) {
    const rawRust = fs.readFileSync(rustPath, 'utf-8')
    const parsed = parseCodeMarkers(rawRust, 'rust')
    rustCode = parsed.cleanCode
    rustMarkers = parsed.markers
  }

  // Generate output
  const output = generateAlgorithmFile({
    yaml,
    pythonCode,
    pythonMarkers,
    rustCode,
    rustMarkers,
  })

  const outputPath = path.join(OUTPUT_DIR, `${slug}.ts`)
  fs.writeFileSync(outputPath, output)
  console.log(`  Generated: ${slug}.ts`)
}

function main(): void {
  console.log('Generating algorithm definitions...\n')

  ensureDir(OUTPUT_DIR)

  // Find all algorithm directories
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content directory found. Creating placeholder...')
    ensureDir(CONTENT_DIR)
    return
  }

  const slugs = fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => {
      const stat = fs.statSync(path.join(CONTENT_DIR, name))
      return stat.isDirectory()
    })
    .filter((name) => {
      return fs.existsSync(path.join(CONTENT_DIR, name, 'algorithm.yml'))
    })

  if (slugs.length === 0) {
    console.log('No algorithms found in content directory.')
    return
  }

  // Process each algorithm
  for (const slug of slugs) {
    try {
      processAlgorithm(slug)
    } catch (error) {
      console.error(`Error processing ${slug}:`, error)
      process.exit(1)
    }
  }

  // Generate index file
  const indexContent = generateIndexFile(slugs)
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent)
  console.log(`  Generated: index.ts`)

  console.log(`\nDone! Generated ${slugs.length} algorithm(s).`)
}

main()
