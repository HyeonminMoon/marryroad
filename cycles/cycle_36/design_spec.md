# Cycle 36 — Design Spec

## Utility: calculateStreak(activeDates: string[])
- Sort dates, iterate backwards from today
- Count consecutive days (today or yesterday must be included)
- Also calculate best streak (longest consecutive run ever)
- Returns { current: number, best: number, isActiveToday: boolean }

## Component: DailyStreak
- Compact card showing:
  - Fire emoji (🔥) with pulse animation when streak > 0
  - Current streak number (large, bold)
  - "일 연속" label
  - Best streak badge (small, secondary)
  - "오늘 아직!" 메시지 if not active today but streak alive
- Glass card style consistent with app theme
- Framer Motion: number count-up, fire scale animation

## Placement
- "오늘" 탭: CoupleMessage 아래, WeeklyProgress 위 (가장 눈에 잘 띄는 위치)
