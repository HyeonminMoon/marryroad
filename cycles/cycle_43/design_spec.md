# Cycle 43 — Design Spec

## Component: NeglectedQuests

### Logic
- For each quest with some completed tasks but not fully done:
  - Find last completedDate from taskExtendedData
  - If last activity > 7 days ago → neglected
- Sort by days since last activity (most neglected first)
- Max 2 alerts

### UI
- Compact amber/orange glass card
- "잊고 있진 않으세요?" header
- Each alert: quest icon + title + "N일 전 마지막 활동" + remaining count
- Clickable → onQuestClick

### Placement
- "오늘" 탭: SmartRecommendation 아래, TodaySection 위
