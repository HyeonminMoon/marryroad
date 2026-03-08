# Cycle 4 — Design Spec

## 1. Data Model Changes

### QuestProgress (quest-store.ts)
```typescript
interface QuestProgress {
  // ... existing fields
  weddingDate: string | null; // ISO date string, e.g. "2026-11-15"
}
```

### Default: `weddingDate: null`

## 2. Store Actions

### setWeddingDate(date: string | null)
Sets the wedding date in progress state.

### grantAchievementXp(xp: number)
Adds XP to progress.xp and recalculates level.

## 3. Utility: lib/utils/dday.ts

### parseRecommendedTiming(timing: string): number | null
- Input: "D-365", "D-180", "D-30" etc.
- Output: number of days before wedding (365, 180, 30)
- Returns null if unparseable

### getTaskUrgency(timing: string, weddingDate: string): 'overdue' | 'due-soon' | 'upcoming' | 'later'
- Computes target date = weddingDate - timing days
- overdue: target date is in the past
- due-soon: target date is within 14 days
- upcoming: target date is within 60 days
- later: everything else

### getDdayCount(weddingDate: string): number
- Returns days until wedding (negative if past)

### getUrgentTasks(quests, progress, weddingDate): UrgentTask[]
- Returns uncompleted tasks sorted by urgency
- Each task includes: questId, taskId, title, questTitle, urgency, targetDate, daysUntilTarget

## 4. Component: DdayDashboard

### Layout
```
┌─────────────────────────────────────────┐
│  Wedding Date Setup (if not set)        │
│  [날짜 선택기]  [저장]                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  D-127  결혼식까지                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━ (시간 바)  │
├─────────────────────────────────────────┤
│  🔴 지금 해야 해요 (overdue)             │
│   - 택일 방식 결정 (D-365, 7일 지남)     │
│   - 예산 계획 수립                       │
│                                         │
│  🟡 이번 달 (due-soon)                   │
│   - 웨딩홀 후보 리스트 작성              │
│                                         │
│  🟢 다가오는 (upcoming)                  │
│   - 스드메 알아보기                      │
└─────────────────────────────────────────┘
```

### Wedding Date Picker
- Simple date input with calendar popup
- Stored in Zustand (persisted)
- Shows encouragement text after setting

### Countdown
- Large D-XXX number
- Time progress bar (from today to wedding)
- Color changes as wedding approaches

### Urgency Groups
- Each group is collapsible
- Tasks show: title, quest name, target date, days until/past target
- Click task → opens quest modal
- Overdue tasks highlighted in red
