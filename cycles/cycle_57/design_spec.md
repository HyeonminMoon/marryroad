# Cycle 57 — Design Spec
## WeddingDateNudge Component
- Props: `onSetDate: (date: string) => void`
- 초기 상태: 축소 (한줄 CTA — "결혼식 날짜를 설정해보세요")
- 확장 상태: inline date input + 설정 버튼 + "나중에 할게요" 링크
- 스타일: purple-to-pink 그라데이션 배경, glassmorphism border
- 위치: Today 탭의 CoupleMessage 바로 아래, SmartRecommendation 위

## Header DdayBadge Fallback
- weddingDate null → "D-Day ?" 텍스트, gray 배경
- weddingDate 있음 → 기존 D-Day 카운트다운 (변경 없음)
