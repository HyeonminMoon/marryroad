# Cycle 5 — Critic Report

## What's Good
1. **Credibility audit worked**: Systematically found and fixed all known fake values. The app now shows only truthful data.
2. **D-Day header badge is high-impact for zero complexity**: A simple `<span>` that creates constant wedding awareness.
3. **Small changes, big polish**: This cycle touched many files but each change was tiny. Good example of a polish cycle.

## Problems Found

### P2 — Header DdayBadge re-renders on every store change
The `useQuestStore` selector reads `progress.weddingDate` but Zustand's default equality check may cause re-renders when other progress fields change. Should use a shallow selector.

### P2 — "later" tasks still show all items
The urgency "later" group can have 100+ tasks. No pagination or limit implemented yet.

### P3 — No empty state for D-Day dashboard when all tasks completed
If all tasks are done, the urgency groups are all empty. Should show a celebration state.

### P3 — Mobile date picker
HTML date input on iOS Safari can be quirky. No custom calendar yet.

## Architectural Observations
- `lib/constants.ts` is clean. If more constants accumulate, consider grouping by domain.
- DdayBadge as a small component inside header.tsx is fine for now. Extract to own file if it grows.

## Missing Features
- Real streak tracking (removed display but never built the backend)
- Budget visualization remains in backlog
