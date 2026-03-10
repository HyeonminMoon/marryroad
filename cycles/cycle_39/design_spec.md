# Cycle 39 — Design Spec

## Component: PreparationPace

### Logic
- timeElapsed: (today - firstActiveDate) / (weddingDate - firstActiveDate) * 100
- prepProgress: completedTasks / totalTasks * 100
- pace = prepProgress - timeElapsed
  - pace > 10 → "ahead" (빠르게 진행 중)
  - pace >= -10 → "on-track" (적절한 속도)
  - pace < -10 → "behind" (서두르세요)

### UI
- Glass card
- Two horizontal bars stacked:
  - "시간" bar (gray/blue gradient)
  - "준비" bar (green/purple gradient)
- Percentage labels on each bar
- Status emoji + message below bars
- Only visible when weddingDate is set

### Placement
- 퀘스트 탭: DdayDashboard 바로 아래
