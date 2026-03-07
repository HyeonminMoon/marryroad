# Cycle 2 - Critic Report

## What's Good
1. **Non-blocking UX**: The toast doesn't interrupt workflow. Users can ignore it completely.
2. **Auto-dismiss with pause**: Smart UX - timer pauses when user engages, continues when they don't.
3. **Upstream data fix**: This directly addresses the #1 learning from Cycle 1.

## Issues Found

### Critical
1. **TaskModal quick-complete doesn't trigger toast**: The TaskModal has its own quick-complete handler that doesn't trigger the celebration toast. This means only TodaySection completions get memo prompts. Need to wire the toast into TaskModal too, or create a centralized completion handler.

### Important
2. **No toast for task-detail-form submissions**: When users use the full form (상세 기록), they already provide a memo there, but the celebration moment is missing.

3. **Journey nudge threshold is hardcoded**: The `>= 5` check for showing the journey link is computed on every render. Should be a simple comparison, not a reduce.

4. **Toast can overlap with locked-quest toast**: Both use fixed bottom positioning. If user clicks a locked quest while celebration toast is showing, they overlap.

### Nice to Have
5. **No toast analytics**: Can't measure if users are actually writing memos.
6. **Single-line only**: Some users might want to write longer notes. Could add a "more" option that expands to textarea.
7. **No photo prompt**: Photos would enrich the journey timeline even more, but adding photo upload to the toast would be too much friction.

## Architecture Notes
- The celebration toast state lives in RoadmapPage. If we add toast to TaskModal, we'll need to either lift the state or use a global event bus.
- Consider making a `useCelebrationToast` hook that encapsulates the state + handlers, so any component can trigger it.
