# Cycle 2 - Improvement Tasks

## Priority 1 (Cycle 3)
1. **Wire celebration toast into TaskModal**: When user quick-completes a task inside the modal, trigger the same celebration toast. May need to pass a callback prop or use a shared hook.

2. **Prevent toast overlap**: Add z-index management or queue system so celebration toast and locked-quest toast don't overlap.

3. **Optimize journey link threshold**: Replace the reduce with a pre-computed value from the store or a simpler check.

## Priority 2 (Cycle 4)
4. **Achievement Badge System**: Unlock badges for milestones. Now that we have the journey timeline AND memo collection, achievements can reward both task completion and data richness ("First Memo Written", "10 Memos", "All Quests Completed").

5. **D-Day Smart Dashboard**: Show upcoming recommended tasks based on wedding date. This was the #3 idea in Cycle 1 and keeps scoring high.

## Priority 3 (Cycle 5+)
6. **useCelebrationToast hook**: Centralize toast state for reuse across components.
7. **Toast expandable textarea**: Option to write longer memos.
8. **Photo upload in task completion flow**: Enrich journey timeline with photos.
