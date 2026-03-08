# Cycle 7 — Design Spec

## QuestProgress Change
```typescript
interface QuestProgress {
  // ... existing
  activeDates: string[]; // ["2026-03-05", "2026-03-06", "2026-03-07"]
}
```

## completeTask Enhancement
After existing logic, check if today's date is already in activeDates:
```typescript
const today = new Date().toISOString().split('T')[0];
if (!state.progress.activeDates.includes(today)) {
  newProgress.activeDates = [...state.progress.activeDates, today];
}
```

## lib/utils/streak.ts
```typescript
function calculateStreak(activeDates: string[]): number
// Sort dates desc, count consecutive from today or yesterday
```

Rules:
- If today is active: streak starts today, count backwards
- If yesterday is active but not today: streak starts yesterday (ongoing, just haven't done today yet)
- Otherwise: streak is 0

## UI: TodaySection
Restore flame icon + "{streak}일 연속" badge in header row.
Only show if streak > 0.

## UI: Header
Small flame badge: "🔥 7" style, next to D-Day badge.
Only visible if streak > 0.

## Achievement
```typescript
{
  id: 'week-streak',
  name: '일주일 연속',
  description: '7일 연속으로 태스크를 완료하세요',
  tier: 'silver',
  xp: 50,
  icon: '🔥',
  check: (p) => calculateStreak(p.activeDates) >= 7,
}
```
