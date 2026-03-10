# Cycle 33 — Design Spec

## 추가 뱃지 (achievements.ts에 추가)

### Bronze
- `challenge-starter`: "챌린지 도전자" — 첫 주간 챌린지 1개 완료

### Silver
- `challenge-week-clear`: "주간 올클리어" — 한 주에 4개 챌린지 모두 완료
- `challenge-streak-2`: "2주 연속 챌린지" — 2주 연속 올클리어

### Gold
- `challenge-streak-4`: "4주 연속 챌린지" — 4주 연속 올클리어 (한 달)

## WeeklyChallenge 데이터 확장
- `weeklyChallenge.completedWeeks: string[]` — 올클리어한 주의 weekStart 목록

## WeeklyChallenge UI 변경
- 챌린지 완료 시 뱃지 이름 표시
- 올클리어 시 특별 연출 + 뱃지 팝업
