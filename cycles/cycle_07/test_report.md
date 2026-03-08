# Cycle 7 — Test Report

## Build: PASS

## Streak Utility
- [x] Empty dates → streak 0
- [x] Today only → streak 1
- [x] Today + yesterday → streak 2
- [x] Yesterday only → streak 1 (grace)
- [x] 2 days ago only → streak 0
- [x] 7 consecutive → streak 7

## UI
- [x] TodaySection: flame + real streak count (hidden when 0)
- [x] Header: streak badge next to D-Day (hidden when 0)
- [x] Achievement: "일주일 연속" silver tier added

## Store
- [x] activeDates recorded on task completion (deduplicated)
- [x] Cleared on reset
