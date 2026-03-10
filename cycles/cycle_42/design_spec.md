# Cycle 42 — Design Spec

## D-Day Milestones

### Data
```
DDAY_MILESTONES = [
  { days: 365, emoji: '🌟', message: '1년 뒤 가장 아름다운 날이 기다리고 있어요' },
  { days: 200, emoji: '✨', message: '200일, 설레는 카운트다운이 시작됐어요' },
  { days: 100, emoji: '💯', message: '100일! 벌써 여기까지 왔어요' },
  { days: 50, emoji: '🎯', message: '50일 남았어요, 거의 다 왔어요!' },
  { days: 30, emoji: '📅', message: '한 달! 마무리 준비를 시작하세요' },
  { days: 14, emoji: '💕', message: '2주 후면 드디어 그 날이에요' },
  { days: 7, emoji: '🌸', message: '일주일! 두근두근 카운트다운' },
  { days: 3, emoji: '💒', message: '3일 남았어요, 곧 만나요' },
  { days: 1, emoji: '🎊', message: '내일이에요! 오늘 밤 푹 쉬세요' },
  { days: 0, emoji: '💍', message: '드디어 오늘! 축하해요' },
]
```

### Logic
- Calculate dday from weddingDate
- Find exact or nearest lower milestone
- Show milestone message if within ±2 days of exact milestone

### UI
- DdayDashboard 카운트다운 아래에 glass 카드로 표시
- emoji + message + "D-N" badge
- scale + fade animation
