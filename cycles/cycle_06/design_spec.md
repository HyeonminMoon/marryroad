# Cycle 6 — Design Spec

## lib/utils/budget.ts

```typescript
interface QuestSpending {
  questId: string;
  questTitle: string;
  questColor: string;
  amount: number;
  percentage: number; // of total spent
}

function getSpendingByQuest(quests, progress): QuestSpending[]
```

Iterates over `progress.taskProgress`, sums `taskCosts` per quest, maps to quest metadata.

## components/quest/budget-chart.tsx

### SVG Donut Chart
- Ring chart using `stroke-dasharray` / `stroke-dashoffset`
- Each segment colored by quest color
- Center text: total spent / total budget
- Below: legend with colored dots, quest name, amount

### Layout
```
┌──────────────────────────────────┐
│  💰 예산 현황                     │
│                                  │
│       ┌─────────┐                │
│       │  2,400만 │  (donut)      │
│       │ / 3,000만│                │
│       └─────────┘                │
│                                  │
│  🟣 웨딩홀  800만 (33%)          │
│  🔴 스드메  600만 (25%)          │
│  🟢 예물    400만 (17%)          │
│  ...                             │
└──────────────────────────────────┘
```

### Props
```typescript
interface BudgetChartProps {
  quests: Quest[];
  progress: QuestProgress;
}
```

## "Later" Group Limit
In DdayDashboard UrgencyGroup, when urgency is "later":
- Show first 5 tasks
- If more exist, show "N개 더 보기" button
- On click, show all. Toggle to "접기"
