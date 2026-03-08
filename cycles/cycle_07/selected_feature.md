# Cycle 7 — Selected Feature

## Real Streak Tracking

### What
Track consecutive days of task completion. Display real streak count in TodaySection and header.

### Store Changes
- Add `activeDates: string[]` to QuestProgress
- Record today's date when a task is completed (deduplicated)

### Streak Calculation
- Sort activeDates descending
- Count consecutive days from today backwards
- If today is not in the list, check if yesterday is (allow 1-day grace? No — strict is better)
- Streak = number of consecutive days including today or ending yesterday

### UI
- TodaySection: restore flame icon + real streak count
- Header: small flame badge next to D-Day badge (only if streak > 0)

### Bonus: Streak Achievement
Add a new achievement: "7일 연속" (7-day streak) — Silver tier
