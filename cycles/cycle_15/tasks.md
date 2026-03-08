# Cycle 15 — Tasks

## Task 1: Remove Photo Placeholder
- [ ] Delete "곧 사진 업로드 기능이 추가됩니다!" block from `task-detail-form.tsx`
- [ ] Remove unused Camera import if no longer referenced

## Task 2: Load Existing Task Data in Form
- [ ] In `task-modal.tsx`: read `taskExtendedData[taskId]` and `taskCosts[taskId]` from store
- [ ] Pass existing data as props to `TaskDetailForm`
- [ ] In `task-detail-form.tsx`: initialize `formData` state from existing data props
- [ ] Ensure completed tasks show their saved data in read-only mode

## Task 3: Urgency-Aware Today Tab
- [ ] In `today-section.tsx`: check if `weddingDate` is set
- [ ] If set, use `getUrgentTasks` from `dday.ts` to sort by urgency
- [ ] Add urgency badge/label on recommended task cards
- [ ] Fallback to existing logic when no wedding date

## Task 4: Verify
- [ ] `npm run build` passes
- [ ] Manual test: reopen completed task → data shows
- [ ] Manual test: today tab with/without wedding date
