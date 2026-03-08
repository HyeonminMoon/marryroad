# Cycle 12 — Selected Feature

## Hero Progress Ring + Animated Stats

Replace the flat progress bar in the sticky header with an animated SVG progress ring (Apple Watch-style) and smooth number counting animations.

### Why This Feature
- First thing users see — sets the emotional tone
- Animated rings are inherently satisfying (dopamine on progress)
- Compact: shows level, XP, quest progress, and budget in one visual unit
- Resonates with Instagram/fitness app aesthetic
- Number counting animations add "polish" feel that distinguishes good apps from great ones

### Key Requirements
- SVG ring: quest completion % as arc, animated on mount + updates
- Inner content: Level + XP with counting animation
- Sub-stats: budget remaining, streak, D-Day — compact row
- Smooth mount animation with Framer Motion
- Replace the current flat progress bar section
