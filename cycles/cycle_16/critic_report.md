# Cycle 16 — Critic Report

## Good
1. Calendar now serves dual purpose (planning + tracking) — major utility upgrade
2. Mobile-first sizing (h-20 cells, text-[10px]) prevents overflow
3. Stats header gives instant overview without scrolling
4. Color coding is intuitive (green=done, purple=planned, red=overdue)

## Issues Found

### P1: No click-to-navigate on planned tasks
- Planned tasks in calendar cells have no click handler
- Users expect to click a planned task and navigate to its quest modal
- **Fix**: Add onClick to task items that triggers quest modal or navigates to /roadmap

### P2: Many planned tasks cluster on same date
- Multiple tasks with same `recommendedTiming` (e.g., "D-180") all land on the same calendar day
- With 137 tasks, some days might have 10+ items, showing "+8 more"
- Not a bug but reduces usefulness on busy dates
- **Fix later**: Consider a day-detail popover on click

### P3: Wedding date month not auto-navigated
- When user opens calendar, it shows current month
- The wedding date might be 9 months away — user must click next month 9 times
- **Fix**: Add "결혼식 달 보기" shortcut button
