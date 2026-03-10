# Cycle 35 — Design Spec

## Component: SmartRecommendation

### Recommendation Types (priority order)
1. **decision-based**: 의사결정 선택 → findDecisionImpact → affects 매칭 → 미완료 태스크 추천
2. **urgency**: weddingDate 기준 overdue 태스크
3. **next-step**: fallback — 첫 번째 미완료 태스크

### Data Flow
```
QuestProgress.decisionSelections
  → findDecisionImpact(selectedOption)
  → impact.affects[] 와 task.title 매칭
  → 미완료 태스크만 필터
  → Recommendation[]
```

### UI Structure
- Glass gradient card (purple→pink)
- Sparkles 아이콘 + "맞춤 추천" 헤더
- 최대 3개 추천 카드 (motion.button)
- 각 카드: emoji + title + description + quest info + ArrowRight

### Placement
- 로드맵 "오늘" 탭: WeeklyChallenge 아래, TodaySection 위
