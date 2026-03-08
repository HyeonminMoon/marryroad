# Cycle 5 — Test Report

## Build: PASS
- `npm run build`: all pages generated successfully
- TypeScript: no errors

## T1: Streak Removal
- [x] "3일 연속" badge removed from TodaySection
- [x] Flame icon import removed
- [x] No visual regression — header row simplified

## T2: Wedding Date Edit
- [x] Pencil icon appears on hover over date text
- [x] Click opens inline date input
- [x] Enter saves, Escape cancels
- [x] Date change reflected immediately in countdown and urgency groups

## T3: D-Day Header Badge
- [x] Badge shows "D-XXX" when wedding date is set
- [x] Badge hidden when no wedding date
- [x] Color: purple (>90 days), amber (30-90), red (≤30)
- [x] Visible on all pages (header is shared)

## T4-T5: Budget Constant
- [x] `DEFAULT_BUDGET = 30000000` in lib/constants.ts
- [x] quest-store.ts uses `DEFAULT_BUDGET` for initial value
- [x] achievements.ts budget-setter check uses `DEFAULT_BUDGET`
- [x] No hardcoded 30000000 remaining in business logic
