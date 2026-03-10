# Cycle 29 — Design Spec

## Calendar Day Click → Bottom Sheet

### Trigger
- 날짜 셀 클릭 (태스크가 1개 이상 있는 날)
- 또는 개별 태스크 아이템 클릭

### Bottom Sheet Content
1. **날짜 헤더**: 선택한 날짜 (예: "2026년 3월 15일 일요일")
2. **태스크 리스트**: 해당 날짜의 모든 태스크
   - 완료: green check + questColor badge + 메모 미리보기
   - 예정: purple clock + urgency badge + 예정일 기준 D-day
3. **태스크 클릭 → TaskDetailSheet 연동**: 기존 sheet 재활용

### 스타일
- Sheet side="bottom", glass background
- 태스크 카드: glass card 패턴
