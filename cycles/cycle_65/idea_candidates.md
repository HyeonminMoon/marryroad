# Cycle 65 — Idea Candidates
## 필수 기능 로드맵에서 다음 항목
1. **설정 페이지** — 커플 이름, 결혼일, 예산을 한곳에서 수정. 현재는 Welcome 온보딩에서만 설정 가능하고 이후 변경 불가.
2. **카테고리별 예산 배분** — 예산을 항목별로 나눠 관리
3. **통계 대시보드** — 전체 진행 현황 한눈에

## 선정: 설정 페이지
- Welcome에서 한번 설정하면 이후 변경할 방법이 없는 것은 치명적
- store에 setCoupleNames, setWeddingDate, setBudgetTotal 메서드는 이미 존재
- UI만 만들면 됨
