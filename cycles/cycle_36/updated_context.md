# Cycle 36 — Updated Context

## Completed
- DailyStreak 컴포넌트 + calculateStreak StreakInfo 확장
- 기존 6개 호출 지점 마이그레이션 + getLongestStreak 제거
- 로드맵 "오늘" 탭 CoupleMessage 아래 배치

## Files Changed
- `lib/utils/streak.ts` — StreakInfo type, best/isActiveToday 추가
- `components/quest/daily-streak.tsx` — NEW
- `components/quest/activity-heatmap.tsx` — getLongestStreak 제거, calculateStreak.best 사용
- `components/header.tsx` — .current 디스트럭처링
- `components/quest/today-section.tsx` — .current 디스트럭처링
- `components/quest/progress-ring.tsx` — .current 디스트럭처링
- `lib/data/achievements.ts` — .current 디스트럭처링
- `app/roadmap/page.tsx` — DailyStreak import + placement

## Ready for Next Cycle
- Cycle 37 시작 가능
