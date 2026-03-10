# Cycle 40 — Design Spec

## Component: CostBreakdown

### Props
- quests: Quest[]
- progress: QuestProgress

### Logic
- Aggregate taskCosts per quest
- Filter out quests with 0 total cost
- Sort by cost descending
- Calculate percentage of total

### UI
- Glass card with "비용 분석" header
- Each quest: icon + title + horizontal bar (quest color) + amount + percentage
- Animated bar width with motion.div
- "총 비용" summary at bottom

### Placement
- Database 페이지: stats grid 아래, VendorCompare 위
