# Cycle 5 — Design Spec

## T1: Remove Streak Display
- Delete the streak badge from TodaySection header
- Keep the "다음 할 일" header text

## T2: Wedding Date Edit
- Add a pencil icon next to the date display in DdayCountdown
- On click, show inline date input (same pattern as budget edit in roadmap)
- Save on Enter/blur, cancel on Escape

## T3: D-Day Header Badge
- In the Header component, read `progress.weddingDate` from store
- If set, show a small badge: "D-127" with color based on proximity
- Position: right side of header, before any existing nav items
- Red if ≤30, amber if ≤90, purple otherwise

## T4-T5: Budget Default Constant
- Create `lib/constants.ts` with `DEFAULT_BUDGET = 30000000`
- Update quest-store.ts initial budget
- Update achievements.ts budget-setter check
