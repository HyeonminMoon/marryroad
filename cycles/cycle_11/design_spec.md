# Cycle 11 — Design Spec

## Activity Heatmap Component

### Data Model Change
Current `activeDates: string[]` only stores unique date strings. To show intensity, we need to know how many tasks were completed per day.

**Option A**: Change to `activityCounts: Record<string, number>` — breaking change to QuestProgress
**Option B**: Keep `activeDates` as-is but allow duplicates — messy
**Option C**: Add a parallel `activityCounts: Record<string, number>` field alongside `activeDates`

**Decision**: Option C — additive, non-breaking. `activeDates` continues to work for streak calculation. `activityCounts` adds per-day task count for heatmap intensity.

### Component Hierarchy
```
ActivityHeatmap
  HeatmapGrid (90-day grid with week columns)
    DayCell (individual day square)
  MonthLabels (top: month abbreviations)
  DayLabels (left: Mon, Wed, Fri)
  Legend (bottom: intensity scale)
  Stats (total active days, current streak, longest streak)
```

### Color Scale (4 levels)
- 0 tasks: gray-100
- 1 task: green-200
- 2-3 tasks: green-400
- 4+ tasks: green-600

### Layout
- Grid: 13 columns (weeks) x 7 rows (days)
- Cell size: 14px with 3px gap
- Month labels above grid
- Day labels (월/수/금) left of grid
- Legend below grid
- Stats summary above grid

### Integration
- Add below AchievementGrid + BudgetChart section on roadmap page
- Collapsible with ChevronDown toggle
- Section title: "활동 기록" with grass emoji
