# AlgoViz Homepage Redesign

Design spec for a complete homepage redesign inspired by Atthena.com, bringing elegant typography, floating icons, and premium animations to AlgoViz.

## Overview

Transform the current homepage from a functional but basic design into a visually striking, premium experience that better represents the quality of the algorithm visualizations inside.

**Reference:** [Atthena.com](https://www.atthena.com/) - elegant serif typography, subtle floating elements, sophisticated animations.

## Design Decisions

### Typography

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Headlines | Playfair Display | 400-700 | Classic serif, elegant feel |
| Body text | Inter / system-ui | 400-500 | Clean sans-serif for readability |
| Code/monospace | JetBrains Mono | 400 | For code snippets and technical notation |

Text color changes from pure white (`#e0e0f0`) to warm cream (`#e8e6e3`) for a softer, more premium feel.

### Color Palette (Hybrid)

Keep the established AlgoViz accent colors but adjust backgrounds and text for warmth.

```
Backgrounds:
- bg:           #0a1210  (dark with green tint, was #0a0a0f)
- surface:      #121a18  (green-tinted surface, was #12121a)
- surfaceLight: #1a2a28  (was #1a1a2e)
- border:       #2a3a38  (was #2a2a3e)

Text:
- text:         #e8e6e3  (warm cream, was #e0e0f0)
- textMuted:    #7a8a8a  (was #7a7a9a)

Accents (unchanged):
- accent:       #00d4aa  (cyan - primary)
- visited:      #6c5ce7  (purple)
- warning:      #ff6b6b  (red)
- current:      #ffd93d  (yellow)
```

### Hero Section

#### Layout
- Centered content with floating icons scattered around
- Main headline in Playfair Display serif
- Highlight on "de verdade" with slide-in animation
- Subtitle in sans-serif below
- No explicit CTA button (scroll indicator instead)

#### Floating Icons
Four categories of icons float around the hero:

1. **Programming Languages**
   - Python emoji (🐍)
   - Text labels: JS, TS, Rust, Go, Java, C++

2. **Code Symbols**
   - `{ }`, `[ ]`, `=>`, `</>`, `&&`, `::`, `**`

3. **Algorithm Notation**
   - `O(n)`, `O(log n)`, `O(1)`, `O(n²)`
   - `BFS`, `DFS`, `stack`, `queue`

4. **Data Structure Shapes** (SVG)
   - Mini binary trees (3-5 nodes)
   - Mini graphs (4-6 nodes with edges)
   - Mini arrays (colored bars)

#### Icon Animations
Mixed behaviors for visual depth:

- **Float group:** ~40% of icons gently bob up/down with slight rotation (CSS animation, no scroll dependency)
- **Parallax group:** ~40% of icons move toward camera on scroll (Three.js, z-position changes)
- **Static group:** ~20% stay fixed but pulse opacity subtly

Each icon has:
- Random initial position (distributed across viewport)
- Random size (0.7x to 1.3x base size)
- Random opacity (0.2 to 0.5)
- Random color from the accent palette

#### Highlight Animation
The "de verdade" text highlight:
- Transparent initially
- On page load (after 0.5s delay), cyan highlight (`#00d4aa33`) slides in from left to right
- Duration: 0.8s ease-out
- Creates a "highlighter pen" effect

### Other Sections

Apply consistent styling across all 7 sections:

#### 1. Hero Section
(Described above)

#### 2. Visualization Section
- Keep the sorting bars 3D animation
- Update text to serif headlines
- Add subtle floating icons in background (fewer than hero)

#### 3. Features Section ("Por que funciona")
- 3-column grid of feature cards
- Cards get subtle hover lift effect
- Icons/numbers in accent color
- Serif for card titles

#### 4. How It Works Section
- Numbered steps (1, 2, 3)
- Each step has icon + title + description
- Connecting line or arrow between steps
- Staggered entrance animation on scroll

#### 5. Algorithms Preview Section
- Grid of algorithm cards
- Each card shows: name, complexity badge, mini preview
- Hover reveals "Explorar" button
- Cards have subtle gradient borders

#### 6. Trails Section
- Trail cards with progress indication
- Premium card styling with shadows
- Icon for each trail theme

#### 7. CTA Section
- Final call to action
- Large serif headline
- Primary button with glow effect
- Floating icons (sparse) in background

### Animation Specifications

#### Scroll-based
- Icons parallax: `translateZ` based on scroll position
- Section fade-in: `opacity` and `translateY` on viewport entry
- Stagger: 100-150ms between sequential elements

#### Continuous
- Icon float: `translateY: ±10px`, duration 3-5s, ease-in-out
- Icon rotation: `rotate: ±5deg`, duration 4-6s
- Particle system: existing, but reduce count to 200 and lower opacity

#### Triggered
- Highlight slide: on page load, 0.8s duration
- Card hover: `translateY: -4px`, `box-shadow` increase, 0.2s
- Button hover: glow pulse

### Technical Implementation

#### New Dependencies
- `@fontsource/playfair-display` - serif font
- `@fontsource/inter` - sans-serif (may already have system-ui fallback)

#### Files to Modify

**Core:**
- `src/lib/colors.ts` - update color palette
- `src/app/page.tsx` - may need layout adjustments
- `src/app/layout.tsx` - add font imports

**Components to update:**
- `src/components/home/sections/HeroSection.tsx` - complete rewrite
- `src/components/home/sections/VisualizationSection.tsx` - typography + icons
- `src/components/home/sections/FeaturesSection.tsx` - cards + typography
- `src/components/home/sections/HowItWorksSection.tsx` - steps + animations
- `src/components/home/sections/AlgorithmsPreviewSection.tsx` - cards + hover
- `src/components/home/sections/TrailsSection.tsx` - cards + styling
- `src/components/home/sections/CTASection.tsx` - typography + button
- `src/components/home/Particles.tsx` - reduce count, adjust opacity
- `src/components/home/HomeSection.tsx` - may need wrapper updates

**New components:**
- `src/components/home/FloatingIcons.tsx` - icon system for hero
- `src/components/home/HighlightText.tsx` - animated highlight wrapper

#### Performance Considerations
- Icons rendered as HTML/SVG (not Three.js) for better performance
- Use CSS transforms for float animations (GPU accelerated)
- Reduce particle count from 300 to 200
- Lazy load fonts
- Use `will-change` sparingly

## Success Criteria

1. Hero loads with floating icons animating smoothly at 60fps
2. Highlight animation plays on first load
3. Scroll parallax feels natural, not jarring
4. Typography hierarchy is clear and elegant
5. Color palette feels premium but maintains AlgoViz identity
6. All 7 sections have consistent styling
7. Mobile responsive (icons reduce on smaller screens)
8. Lighthouse performance score stays above 80

## Out of Scope

- Algorithm page redesign (separate project)
- Trail page redesign (separate project)
- New features or content
- Backend changes
- Authentication/user system
