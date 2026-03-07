# Cycle 2 - Learning Report

## What Worked Well
1. **Upstream thinking**: Instead of making the journey timeline smarter, we fixed the data input problem. This is the correct product instinct - fix the source, not the symptoms.
2. **Auto-dismiss pattern**: Non-blocking toast with timer + pause-on-focus is an excellent UX pattern for optional data collection. Respects user agency.
3. **Store extension was clean**: Adding `updateTaskMemo` was a simple, focused change that didn't touch existing logic.

## What Failed / Could Be Better
1. **Incomplete coverage**: Only TodaySection triggers the toast, not TaskModal. This is a gap that should have been caught in design.
2. **No centralized completion flow**: The app has 3 ways to complete a task (TodaySection, TaskModal quick-complete, TaskModal detail form). The celebration moment should be universal.

## Key Insights
1. **"Multiple completion paths" problem**: Having 3 different completion UIs means 3 places to maintain toast logic. A centralized hook or event system would be cleaner.
2. **The power of "optional by default"**: Making the memo optional (auto-dismiss) but easy (one input) is the right friction level. Users who care will type; others won't be blocked.
3. **Feature interconnection**: Cycle 1 (journey) and Cycle 2 (memo toast) are deeply connected. The toast feeds the timeline. This is good product thinking - features should reinforce each other.

## Process Improvements
- Before building, check all code paths that trigger the target behavior (e.g., all task completion methods)
- Design for "universal" behaviors first, then implement per-component

## Architecture Decision
- Will create a `useCelebrationToast` hook in a future cycle to centralize toast state
- The hook pattern is better than a global event bus for React

## Next Cycle Focus
The two biggest remaining product gaps:
1. **Achievement system** - gamification layer that rewards task completion AND data richness
2. **D-Day Dashboard** - practical value (what should I do this week?)
Going with achievements because it reinforces the existing gamification + memo collection loop.
