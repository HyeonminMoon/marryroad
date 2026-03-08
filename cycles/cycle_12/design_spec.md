# Cycle 12 — Design Spec

## Progress Ring Component

### Visual Layout
```
┌──────────────────────────────────────┐
│  [Ring with %]   Level 3             │
│                  450 / 600 XP        │
│                  ████████░░ 75%      │
│                                      │
│  D-365  ·  🔥 5  ·  1,200만/3,000만   │
└──────────────────────────────────────┘
```

### SVG Ring
- Outer radius: 48px, stroke width: 8px
- Background: gray-200, foreground: gradient purple-to-pink
- Animated: stroke-dashoffset transitions from 0% to actual %
- Inner text: percentage number with counting animation
- Round linecap for modern feel

### useCountUp Hook
```typescript
function useCountUp(target: number, duration?: number): number
```
- Returns animated current value that counts from 0 to target
- Uses requestAnimationFrame for smooth animation
- Easing: ease-out cubic
- Default duration: 1000ms
- Re-triggers when target changes

### Stats Row
- Compact horizontal row below the ring
- D-Day badge (if set), Streak badge (if > 0), Budget summary
- Separator dots between items

### Integration
- Replace the entire sticky header section (lines 217-288 of roadmap/page.tsx)
- Remove: flat progress bar, level badge, budget editor from header
- Budget edit moves to budget chart section (already there)
- Keep the sticky behavior with backdrop blur
