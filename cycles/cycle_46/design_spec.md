# Cycle 46 — Design Spec
## CompletionForecast
- Props: `quests`, `progress`
- 계산: 첫 활동일부터 현재까지 경과일 → 완료 작업 수 → 일일 평균 완료율
- 남은 작업 수 / 일일 평균 = 예상 남은 일수
- 결혼일이 있으면 마감 전 완료 가능 여부도 표시
- glassmorphism 카드, Calendar 아이콘, 보라색 accent
- 활동일이 3일 미만이면 "데이터 부족" 표시 (신뢰도 확보)
