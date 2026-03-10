# Cycle 40 — Learning Report

## What Worked
1. formatAmount 유틸이 억/만 단위 변환을 깔끔하게 처리
2. 비용 > 0 필터로 빈 바 방지
3. quest color를 바 색상으로 직접 적용하는 패턴이 일관적

## Key Insight
같은 데이터(taskCosts)라도 컨텍스트에 따라 다른 시각화가 필요. stats 탭은 예산 대비, database는 분포 비교.

## Cumulative State (40 cycles)
- All previous features (39 cycles)
- **NEW**: Cost Breakdown Chart — 퀘스트별 비용 분포 바 차트 (Database 페이지)

## Next Cycle Should
- 기존 기능 간 연결 강화 (예: 바 클릭→필터, Journey→TaskDetail)
- 또는 새로운 감성/실용 기능
