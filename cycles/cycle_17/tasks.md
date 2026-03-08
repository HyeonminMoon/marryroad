# Cycle 17 — Tasks

## Task 1: Budget Empty State Edit
- [ ] In `budget-chart.tsx`: show edit button in `!hasSpending` branch
- [ ] Update empty state text to be more actionable

## Task 2: SVG Gradient ID Fix
- [ ] In `progress-ring.tsx`: use `useId()` for unique gradient ID
- [ ] Update `stroke="url(#...)"` reference

## Task 3: Stats Tab Badge
- [ ] In `roadmap/page.tsx`: compute `hasNewAchievements` by comparing unlocked vs seen
- [ ] Add red dot badge to Stats tab button when new achievements exist
- [ ] Mark as seen when Stats tab is selected

## Task 4: Data Export
- [ ] Create `lib/utils/data-io.ts` with `exportData()` function
- [ ] Read from localStorage `marryroad-quest-progress` key
- [ ] Generate downloadable JSON file with metadata (version, exportDate)

## Task 5: Data Import
- [ ] Add `importData()` function to `data-io.ts`
- [ ] Validate imported JSON schema before applying
- [ ] Merge or replace progress in quest-store
- [ ] Show confirmation dialog before overwriting

## Task 6: UI for Export/Import
- [ ] Add data management section in Stats tab (below BudgetChart)
- [ ] Export button + Import button (file input)
- [ ] Success/error feedback

## Task 7: Build & Verify
- [ ] `npm run build` passes
