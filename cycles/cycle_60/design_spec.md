# Cycle 60 — Design Spec
## Bulk Mode UX
- 진입: 모달 footer "일괄 완료" 버튼 (미완료 2개 이상일 때만 표시)
- 선택: 미완료 태스크에 Square/CheckSquare 아이콘 토글
- 선택 상태: purple-50 배경 + purple border
- 완료: "N개 완료" 버튼 → 선택 태스크 일괄 completeTask + confetti
- 취소: 선택 초기화 + 일반 모드 복귀
- 이미 완료된 태스크는 기존 CheckCircle 유지

## 데이터 흐름
```
bulkSelected Set<string>
  → handleBulkComplete()
    → for (taskId) completeTask(questId, taskId, undefined, {completedDate})
      → confetti
      → setBulkMode(false)
```
