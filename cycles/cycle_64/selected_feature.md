# Cycle 64 — Selected Feature
## 하객 관리 (Guest Management)
결혼식의 핵심 기능. 하객 목록 CRUD, RSVP 상태 추적, 신랑/신부측 구분, 축의금 기록, 식사 선택 관리.

### 범위
- Guest 타입 시스템 (side, relation, RSVP, meal, plusOne, giftAmount)
- Zustand persist store (addGuest, updateGuest, removeGuest, getStats)
- /guests 전용 페이지 (통계 카드, 필터, 검색, 추가/수정 폼, 목록, 식사 요약)
- 헤더 네비게이션 연동 (데스크톱 + 모바일)
