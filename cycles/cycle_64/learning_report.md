# Cycle 64 — Learning Report
## What Worked
- 별도 store 분리 전략: guest-store를 quest-store와 독립시킴으로써 관심사 분리 달성
- 타입을 먼저 정의하고 store → page 순서로 구현하면 타입 안전성 자연스럽게 확보

## Key Insight
- getStats()를 store 내부에 두면 컴포넌트에서 직접 계산 로직을 반복하지 않아도 됨
- 다만 get() 호출이라 reactive하지 않음 — 컴포넌트에서 매번 호출해야 최신값을 얻음

## 다음 사이클
필수 기능 계속: 설정 페이지 또는 카테고리별 예산 배분
