# Cycle 49 — Design Spec
## UpcomingDeadlines
- Props: `tasksByDate: Record<string, CalendarDayTask[]>`
- 오늘 이후 planned 작업만 필터 → 날짜순 정렬 → 최대 5개
- 각 항목: 퀘스트 아이콘 + 작업명 + D-N 일 표시
- urgency 색상: overdue(red), soon(amber), normal(gray)
- glassmorphism 카드, Clock 아이콘
