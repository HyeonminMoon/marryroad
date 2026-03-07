# Cycle 2 - Selected Feature

## Celebration Memo Toast

### Problem
Quick-complete is the primary task completion path but only records the date. The Journey Timeline from Cycle 1 needs memos to create emotional narrative. Without memos, the timeline is just a list of task names.

### Solution
After a task is quick-completed (from TodaySection or TaskModal), show a **non-blocking bottom sheet** that:
1. Celebrates the completion (confetti already happens)
2. Shows a memo input with warm placeholder
3. Auto-dismisses after 6 seconds if user doesn't interact
4. If user types and submits, saves memo to store's taskExtendedData
5. Includes a subtle "여정에서 보기" link to /journey

### Key Design Decisions
- **Non-blocking**: User can ignore it completely. No forced interaction.
- **Auto-dismiss**: 6 second timer with progress bar. Pauses on hover/focus.
- **Pre-filled date**: Today's date shown but not editable in toast (too much friction)
- **Single input**: Just a text field. Not a full form. "한 줄이면 충분해요"
- **Journey nudge**: After 5+ completed tasks, toast includes "여정 타임라인에서 확인" link

### Success Metrics
- % of quick-completes that result in a memo (target: 30%+)
- Average memo length > 10 characters
- Journey page visit rate after toast interaction
