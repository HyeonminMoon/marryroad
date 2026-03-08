# Cycle 4 — Learning Report

## What Worked
1. **Data-driven features win**: The `recommendedTiming` field existed in every task from day 1 but was invisible. Surfacing existing data created massive value with minimal effort.
2. **Fix debt early**: Resolving the achievement XP credibility bug alongside a new feature was efficient — one commit, two improvements.
3. **Type-first development**: Adding `weddingDate` to the type first, then letting TypeScript catch all the places that needed updating (completeTask, resetProgress) was reliable.

## What Failed
1. **Forgot edit capability**: Built a "set" flow but not an "edit" flow. Classic product mistake — always design for correction, not just creation.
2. **Didn't audit all hardcoded values**: Fixed achievement XP credibility but missed the streak "3일 연속" — same category of bug. Should have done a full audit.

## Key Insights
1. **Time is the missing dimension**: Every wedding planning tool needs time awareness. The quest/gamification layer is fun, but practical value comes from knowing WHEN.
2. **Credibility audit pattern**: When fixing one "display without backing data" bug, sweep the entire app for others. We found XP in Cycle 3, fixed it in Cycle 4, but missed streak. Pattern: after fixing one credibility bug, grep for all hardcoded display values.
3. **Urgency drives action**: Showing "7일 지남" in red is more motivating than any gamification badge. Practical urgency > artificial gamification.

## Architecture Notes
- D-Day utility is pure functions (no side effects) — easy to test and reuse
- Store changes were minimal: one field + two actions
- DdayDashboard is self-contained but could be split if it grows (DatePicker, Countdown, UrgencyList)

## Cumulative Product State
After 4 cycles:
- Quest/Task gamification (original)
- Journey Timeline (Cycle 1)
- Celebration Memo Toast (Cycle 2)
- Achievement Badge System (Cycle 3) — now with real XP
- D-Day Dashboard (Cycle 4)

Feature loops:
```
1. Complete task → Toast → Memo → Journey → Achievement → Motivation
2. Set wedding date → See urgency → Prioritize tasks → Complete on time
```

Two loops now: emotional (1) and practical (2). The product is becoming well-rounded.

## Next Cycle Focus
1. Fix P1: Wedding date edit + streak fix (credibility sweep)
2. Build: Either D-Day header badge (small but high-visibility) or Budget Visualization (practical value)

Recommendation: **D-Day header badge + streak fix + credibility audit** — small scope, high polish. The product needs consolidation before adding another big feature.
