# Cycle 23 — Design Spec

## QuestBubble States

### Completed
- bg: green gradient (from-emerald-400 to-green-500)
- border: 3px solid white/30
- glow: green outer glow (0 0 24px rgba(34,197,94,0.5))
- inner: white check icon
- effect: subtle pulse glow

### In-Progress
- bg: gradient from-violet-500 to-purple-600
- border: 3px solid white/20
- glow: purple outer glow
- ring: white progress arc
- inner: quest icon (white)

### Available
- bg: glass (backdrop-blur-xl, bg-white/20 dark:bg-white/10)
- border: 2px solid purple-400/50, dashed
- glow: soft purple pulse
- shimmer: CSS gradient sweep animation
- inner: quest icon (purple)
- label: "시작!" badge with bounce

### Locked
- bg: transparent
- border: 2px solid gray-300/40, dashed
- no glow
- inner: lock icon (gray-400)
- desaturated

## Connector Lines
- Active: SVG gradient (purple-400 → pink-400), strokeWidth 2.5, glow filter
- Active animated: strokeDasharray "8 4" with CSS animation dashOffset
- Locked: gray-300, opacity 0.2, dasharray "4 8"

## Performance
- CSS animations only (no JS requestAnimationFrame)
- GPU-accelerated: transform, opacity, filter
- @keyframes for shimmer and dash flow
