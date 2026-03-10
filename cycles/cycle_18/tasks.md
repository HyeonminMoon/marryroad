# Cycle 18 — Tasks

## Task 1: Add `bulkCompleteQuest` to quest-store
- [ ] New action: `bulkCompleteQuest(questId: string)`
- [ ] Marks all tasks in quest as completed (today's date)
- [ ] Grants XP for each task + quest completion bonus
- [ ] Updates activeDates, activityCounts, completedQuestIds

## Task 2: Welcome Flow Step 3 — "어디까지 했나요?"
- [ ] After date step, show new step with two choices:
  - "처음 시작해요" → /roadmap
  - "이미 준비 중이에요" → Step 4 (Quick Setup)
- [ ] Update step counter (1-2-3 instead of 1-2)

## Task 3: Quick Setup Screen (Step 4)
- [ ] Show 19 quests as cards with icons/colors
- [ ] Each card: 3-state toggle [안 했어요 | 진행 중 | 다 했어요]
- [ ] Default: "안 했어요" for all
- [ ] "다 했어요" → mark for bulk completion
- [ ] "진행 중" → expand to show individual tasks with checkboxes
- [ ] Bottom: "설정 완료" button → apply all selections → /roadmap

## Task 4: Apply Quick Setup Selections
- [ ] "다 했어요" quests → call `bulkCompleteQuest`
- [ ] "진행 중" quests → call `completeTask` for individually checked tasks
- [ ] Show progress animation during application
- [ ] Navigate to /roadmap when done

## Task 5: Build & Verify
- [ ] `npm run build` passes
