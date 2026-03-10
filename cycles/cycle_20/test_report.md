# Cycle 20 — Test Report

## Build
- `npm run build` ✅ 통과

## Functional Tests
1. ✅ 이번 주 완료 태스크 수 표시 (activityCounts에서 월~일 합산)
2. ✅ 지난 주 대비 증감 표시 (TrendingUp/Down/Minus 아이콘)
3. ✅ 연속 활동일 계산 (오늘/어제부터 역순)
4. ✅ 미니 바 차트 7개 바 (높이 비율 기반)
5. ✅ 오늘 요일 하이라이트 (bold + purple)
6. ✅ 웨딩 날짜 있을 때 주당 권장 태스크 수 표시
7. ✅ 웨딩 날짜 없을 때 권장 라인 숨김
8. ✅ 활동 기록 없을 때 컴포넌트 숨김 (return null)
9. ✅ weddingDate가 null일 때 타입 에러 없음 (|| undefined 처리)

## Edge Cases
- ✅ activityCounts가 빈 객체일 때
- ✅ activeDates가 빈 배열일 때
- ✅ 오늘이 일요일일 때 (getDay()=0 → Monday index 조정)
- ✅ streak이 0일 때 Flame 아이콘 숨김
