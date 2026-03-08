# Cycle 16 — Tasks

## Task 1: Calculate Planned Dates from recommendedTiming
- [ ] In `calendar/page.tsx`, add `plannedTasksByDate` memo
- [ ] When `weddingDate` exists: for each uncompleted task, compute targetDate = weddingDate - daysBefore
- [ ] Group planned tasks by date string (YYYY-MM-DD)
- [ ] Reuse `parseRecommendedTiming` from `dday.ts`

## Task 2: Visual Distinction — Planned vs Completed
- [ ] Planned events: dashed left border, lighter background, different icon treatment
- [ ] Completed events: solid style (existing green treatment)
- [ ] Day cell badge: show both counts (e.g., completed count in green, planned count in purple)

## Task 3: Legend + Calendar Description Update
- [ ] Update header subtitle from "완료한 작업을 날짜별로 확인하세요" to reflect both modes
- [ ] Add simple legend: green dot = completed, purple dot = planned
- [ ] Update totalCompletedTasks stat to also show planned count

## Task 4: Mobile Responsiveness
- [ ] Calendar cells are currently h-32 — may be too tall on mobile
- [ ] Consider reducing cell height on mobile (h-20 or h-24)
- [ ] Truncate task titles more aggressively on small screens

## Task 5: Build & Verify
- [ ] `npm run build` passes
- [ ] Visual inspection of calendar with planned events
