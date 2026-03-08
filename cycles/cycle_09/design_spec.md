# Cycle 9 — Design Spec

## T1: localStorage for dismissed state
In roadmap page, replace useState with:
```typescript
const [dismissed, setDismissed] = useState(() =>
  typeof window !== 'undefined' && localStorage.getItem('couple-setup-dismissed') === 'true'
);
```

## T2: Edit button on DailyMessage
Add a small settings icon. On click, clear coupleNames from store → shows CoupleSetup again.

## T3: 50 messages
Expand the MESSAGES array in daily-messages.ts

## T4: activeDates trim
In completeTask, after adding today, filter to keep only dates within last 90 days.

## T5: Streak achievements
Add to achievements.ts:
- week-streak-2: 14일 연속 (Gold, 75 XP)
- month-streak: 30일 연속 (Gold, 100 XP)
