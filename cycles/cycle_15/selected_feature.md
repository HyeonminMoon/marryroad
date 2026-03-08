# Cycle 15 — Selected Feature

## Credibility Polish Bundle

Three targeted fixes that make the existing MVP feel complete and trustworthy:

1. **Remove photo placeholder** — Delete "곧 사진 업로드 기능이 추가됩니다!" from TaskDetailForm
2. **Load existing task data** — Pass saved memo/vendor/cost/rating to TaskDetailForm when reopening
3. **Urgency-aware today tab** — Use weddingDate + recommendedTiming to prioritize urgent tasks

### Why This Over New Features
- P0 + P1 bugs actively hurt user trust
- Small effort, massive perceived quality gain
- Strengthens the existing gamification loop instead of adding new surface area
