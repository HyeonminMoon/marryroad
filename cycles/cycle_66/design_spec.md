# Cycle 66 — Design Spec

## 데이터 모델
- `QuestProgress.categoryBudgets: Record<string, number>` — 퀘스트ID → 배분 예산(원)
- `setCategoryBudget(questId, amount)` — 개별 카테고리 예산 설정

## UI (`components/quest/budget-allocation.tsx`)
- 전체 배분 진행률 바 (배분액/총예산)
- 카테고리별 행: 아이콘 + 이름 + 배분액 (클릭 시 인라인 편집)
- 배분된 카테고리: 지출 대비 프로그레스 바
- 미배분 카테고리: "설정" 텍스트 버튼
- Glassmorphism 카드

## 배치
- 로드맵 페이지, BudgetChart 바로 아래
