# Cycle 47 — Design Spec
## JourneyMonthlyRecap
- Props: `events: JourneyEvent[]`
- 월별 그룹핑 (date.slice(0,7) → "YYYY-MM")
- 각 월: 완료 건수, 가장 활발한 퀘스트(건수 + 색상 dot)
- 최근 월부터 역순 표시
- compact 수평 스크롤 pill 형태
- glassmorphism 카드
