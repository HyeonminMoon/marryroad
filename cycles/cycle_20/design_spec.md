# Cycle 20 — Design Spec

## Component: WeeklyProgress

```tsx
interface WeeklyProgressProps {
  activityCounts: Record<string, number>;
  activeDates: string[];
  weddingDate?: string;
  totalRemainingTasks: number;
}
```

## Layout
```
┌─────────────────────────────────────────┐
│  이번 주 활동                    X개 완료│
│  ↑2 vs 지난 주  |  🔥 3일 연속         │
│                                         │
│  ▁ ▃ █ ▅ ▂ ▇ ▁                         │
│  월 화 수 목 금 토 일                    │
│                                         │
│  (if weddingDate)                       │
│  💍 D-Day까지 26주, 주당 ~5개 권장      │
└─────────────────────────────────────────┘
```

## Data Logic
- `getWeekRange(date)`: 월~일 기준 해당 주 시작/끝 Date 반환
- `getWeeklyCount(activityCounts, weekStart)`: 해당 주 7일간 합산
- `getStreak(activeDates)`: 오늘부터 역순으로 연속 활동 일수
- `getWeeklyPace(weddingDate, remainingTasks)`: 주당 권장 태스크 수

## Styling
- 카드: bg-gradient, rounded-2xl, shadow-sm
- 바 차트: 7개 div, height proportional to count, max 32px
- 증감: 양수=green ↑, 음수=red ↓, 0=gray –
- 스트릭: Flame icon + 숫자
