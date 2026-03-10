# Cycle 27 — Learning Report

## What Worked
1. 페이지 배경을 purple-50/30 그라데이션으로 바꾸니 glass 카드가 더 돋보임
2. 캘린더 셀은 backdrop-blur 없이 bg-white/50만 써도 충분 — 셀이 많아서 blur는 성능 부담
3. border를 /50 opacity로 줄이니 전체적으로 가벼운 느낌

## Key Insight
Glass 패턴은 "큰 컨테이너"에는 full glass (backdrop-blur-lg), "반복 셀"에는 light glass (bg-white/50만)로 차등 적용하면 성능과 심미성 모두 잡을 수 있다.

## Cumulative State (27 cycles)
- All previous features (26 cycles)
- **UPGRADED**: 캘린더 페이지 전체 glass 통일 (7곳)
- **UPGRADED**: 캘린더 오늘 하이라이트 blue→purple 테마

## Next Cycle Recommendation
- DdayDashboard glass 통일
- Or: task-modal/journey-card glass 통일
- Or: 캘린더 일정 클릭 → 태스크 상세 시트 연동
