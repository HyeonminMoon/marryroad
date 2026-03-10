# Cycle 66 — Learning Report
## What Worked
- Record<string, number> 패턴으로 유연한 카테고리별 데이터 저장
- 기존 store의 persist 마이그레이션에서 `|| {}` 기본값으로 이전 데이터 호환

## Key Insight
- 예산 관리는 "전체 → 카테고리" 계층이 자연스러움. 먼저 전체 예산을 정하고, 그 다음 카테고리별로 배분.
- BudgetChart(전체)와 BudgetAllocation(카테고리)을 별도 컴포넌트로 분리한 것이 관심사 분리에 좋음

## 다음 사이클
통계 대시보드 또는 Lenny's Newsletter 인사이트 적용
