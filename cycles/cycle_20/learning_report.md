# Cycle 20 — Learning Report

## What Worked
1. `activityCounts` 데이터가 이미 충분히 잘 구조화되어 있어서 주간 합산이 단순
2. 미니 바 차트가 7개 div로 구현 가능 — 차트 라이브러리 불필요
3. streak 계산이 정렬된 배열에서 역순 탐색으로 O(n)에 해결
4. `getMonday()` 유틸이 일요일(getDay=0) 엣지 케이스 처리

## What Could Be Better
- 주간 데이터가 빈 상태일 때의 UX가 아직 다듬어지지 않음
- 이번 주 0건이면 "이번 주 아직 시작 안 했어요" 같은 격려 문구가 더 나을 수 있음

## Key Insight
결혼 준비의 가장 큰 적은 "내가 잘하고 있는지 모르겠다"는 불안. 구체적 숫자 + 비교(지난 주 대비) + 시각화(바 차트)가 이 불안을 해소. 특히 streak은 "연속으로 뭔가 하고 있다"는 감각이 매우 강력한 동기부여.

## Cumulative State (20 cycles)
- All previous features (19 cycles)
- **NEW**: Weekly Progress Summary Card
- **NEW**: 이번 주 완료 수 + 지난 주 대비 증감
- **NEW**: 연속 활동일 (streak)
- **NEW**: 미니 바 차트 (월~일)
- **NEW**: 주당 권장 태스크 수 (웨딩 날짜 기반)

## Next Cycle Recommendation
- 알림/리마인더 시스템 (결혼 준비 태스크 기한 알림)
- Or: 퀘스트 완료 시 축하 모션 강화 (퀘스트 레벨 confetti)
- Or: 공유 기능 (진행률 이미지 생성 + SNS 공유)
