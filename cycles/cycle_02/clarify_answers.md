# Cycle 2 - Clarify Answers

## 1. Why timeline data will be empty
The quick-complete button (most common path) calls `completeTask(questId, taskId)` with only `{ completedDate: today }`. No memo prompt. The "상세 기록" button exists but requires extra clicks and is hidden behind the task detail form. **90% of users will quick-complete, getting only a date.**

## 2. Current friction
- Quick complete: 1 tap -> done (no data besides date)
- Detail form: click "상세 기록" -> fill form -> submit (too many steps)
- There's no middle ground

## 3. How to collect without friction
**The "celebration micro-moment" pattern**: After quick-complete, show a brief (auto-dismissing) bottom sheet with:
- Today's date pre-filled (editable)
- One-line memo input (optional, placeholder: "한 줄로 기록해볼까요?")
- Skip button ("건너뛰기")
This appears for 5 seconds then auto-dismisses if ignored. Not blocking, not annoying.

## 4. Minimum data for meaningful timeline
- **Date**: Auto-filled with today (already done in quick-complete)
- **Memo**: Even one sentence makes the timeline personal
- Date alone = timeline structure. Date + memo = timeline story.

## 5. Auto-fill vs ask
- Date: **auto-fill** (today's date, editable)
- Memo: **gently ask** (not required, disappears if skipped)
- Cost: only ask when the task has typicalCost fields (already implemented)

## 6. Gamified completion patterns
- Duolingo: Shows streak + XP animation after completion, then moves on
- Habitica: Quick complete with optional notes
- Forest: Timer completion with brief stats
- **Our approach**: Quick complete + celebration toast with optional memo = best of both worlds
