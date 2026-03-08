# Cycle 16 — Design Spec

## Data Flow

```
progress.weddingDate → parseRecommendedTiming(task.recommendedTiming)
  → targetDate = weddingDate - daysBefore
  → group by YYYY-MM-DD key
  → merge with existing completedTasksByDate
```

## CalendarTask Type Extension
```typescript
interface CalendarTask extends Task {
  questTitle: string;
  questColor: string;
  questIcon: string;
  completedDate?: string;  // for completed tasks
  plannedDate?: string;    // for planned tasks
  isPlanned?: boolean;     // visual distinction flag
  urgency?: TaskUrgency;   // urgency classification
}
```

## Visual Design

### Day Cell Layout
```
┌─────────────────┐
│ 15  [2] [1]     │  ← day number, green badge (completed), purple badge (planned)
│ ✅ 예식장 계약    │  ← completed task (solid green-tinted bg)
│ 🟣 드레스 상담    │  ← planned task (dashed purple-tinted bg)
│ +1 more          │
└─────────────────┘
```

### Color Coding
- Completed: `bg-{questColor}20` (existing) — solid left border
- Planned: `bg-purple-50` + dashed left border + `opacity-70`
- Overdue planned: `bg-red-50` + dashed left border + red tint

### Header Stats
```
[완료 12] [예정 45] [지연 3]
```

## Mobile Adaptation
- Cell height: `h-20 md:h-32`
- Show max 2 tasks on mobile (vs 3 on desktop)
- Smaller text (text-[10px] on mobile)
