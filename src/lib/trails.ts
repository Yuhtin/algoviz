// src/lib/trails.ts
import type { Trail, Mission } from '@/types/trail'

// Import all generated trails
import * as generatedTrails from '@/generated/trails'

// Collect all trails into an array
const trailsMap = new Map<string, Trail>()

for (const [key, trail] of Object.entries(generatedTrails)) {
  if (key.endsWith('Trail') && trail && typeof trail === 'object' && 'slug' in trail) {
    trailsMap.set((trail as Trail).slug, trail as Trail)
  }
}

export function getAllTrails(): Trail[] {
  return Array.from(trailsMap.values())
}

export function getTrailBySlug(slug: string): Trail | undefined {
  return trailsMap.get(slug)
}

export function getMission(trailSlug: string, missionSlug: string): Mission | undefined {
  const trail = getTrailBySlug(trailSlug)
  if (!trail) return undefined
  return trail.missions.find((m) => m.slug === missionSlug)
}

export function getMissionIndex(trail: Trail, missionSlug: string): number {
  return trail.missions.findIndex((m) => m.slug === missionSlug)
}

export function getNextMission(trail: Trail, currentMissionSlug: string): Mission | undefined {
  const index = getMissionIndex(trail, currentMissionSlug)
  if (index === -1 || index >= trail.missions.length - 1) return undefined
  return trail.missions[index + 1]
}

export function getPreviousMission(trail: Trail, currentMissionSlug: string): Mission | undefined {
  const index = getMissionIndex(trail, currentMissionSlug)
  if (index <= 0) return undefined
  return trail.missions[index - 1]
}
