# Cycle 68 — Selected Feature
## UI 경량화 — "가벼운 서비스" 원칙 적용

### 삭제/제거
1. **SmartRecommendation 제거** — SmartHomeSummary가 이미 "오늘의 추천" 포함. 중복.
2. **NeglectedQuests 제거** — "방치된 퀘스트" 부정적 톤. 가벼운 서비스에 어울리지 않음.
3. **ProgressMilestone 제거** — SmartHomeSummary 진행률과 중복
4. **WeeklyProgress 제거** — 통계가 너무 많음. WeeklyTrend(Stats탭)으로 충분

### 이동
5. **DataManagement** — Stats 탭 → Settings 페이지 (이미 존재, 중복 제거)
6. **QuestVisibility** — Stats 탭 → Settings 페이지로 이동
7. **ShareCardButton** — Stats 탭 → Settings 페이지로 이동

### 결과
- Today 탭: 7 → 4 섹션 (Setup, SmartHomeSummary, TodaySection, 인사이트 2개)
- Stats 탭: 8 → 5 섹션 (WeeklyTrend, Forecast, Comparison, Heatmap, Budget)
