# Cycle 2 - Tasks

## Feature: Celebration Memo Toast

### Task 1: Create CelebrationToast component
- Bottom-positioned toast with slide-up animation
- Shows: task title, memo input, submit button, skip button
- Auto-dismiss timer (6s) with visual progress bar
- Timer pauses on input focus
- Framer Motion for enter/exit animations

### Task 2: Add updateTaskMemo action to quest-store
- New action: `updateTaskMemo(questId: string, taskId: string, memo: string)`
- Updates progress.taskProgress[questId].taskExtendedData[taskId].memo
- Doesn't affect completion status, just enriches data

### Task 3: Wire CelebrationToast into RoadmapPage
- After any quick-complete (TodaySection or TaskModal), show toast
- Pass questId, taskId, taskTitle to toast
- On memo submit, call updateTaskMemo
- Toast auto-dismisses or user dismisses manually

### Task 4: Add journey nudge link
- After 5+ total completed tasks, toast shows "여정에서 확인하기" link
- Small, non-intrusive, below the memo input

### Task 5: Memoize journey data (from Cycle 1 critique)
- Wrap extractJourneyEvents in useMemo in /journey page
- Depends on quests + progress as deps
