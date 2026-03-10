# Cycle 37 — Design Spec

## Component: ProgressMilestone

### Milestones
| % | Emoji | Title | Message |
|---|-------|-------|---------|
| 25 | 🌱 | 첫 발걸음 | 벌써 1/4이나 완료했어요! |
| 50 | 🎯 | 절반 돌파 | 반이나 왔어요, 대단해요! |
| 75 | 🚀 | 거의 다 왔어요 | 결혼 준비의 3/4을 완료! |
| 100 | 🎉 | 완벽한 준비 | 모든 준비를 마쳤어요! |

### Logic
- Calculate overall completion: completedTasks / totalTasks * 100
- Find highest reached milestone (25, 50, 75, 100)
- Track dismissed milestones in localStorage
- Show only the most recent unacknowledged milestone

### UI
- Glass card with gradient background matching milestone level
- Large emoji + milestone title + percentage + message
- Dismiss button (X) to acknowledge
- Confetti trigger on first render of 50%+ milestones
- Framer Motion scale + fade in

### Placement
- "오늘" 탭: DailyStreak 아래, WeeklyProgress 위
