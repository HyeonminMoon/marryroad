# Cycle 63 — Design Spec
## M7: Estimated Total Cost
- useMemo로 모든 퀘스트의 typicalCostMin/Max 합산
- BudgetChart 카테고리 바 아래에 border-t 구분선 + 한 줄 표시
- 포맷: formatAmount(min)~formatAmount(max)원

## M8: Quick Complete Undo
### Store: uncompleteTask(questId, taskId)
- completedTaskIds에서 taskId 제거
- taskCosts에서 해당 비용 삭제 + budget.spent 차감
- taskExtendedData에서 해당 데이터 삭제
- completedQuestIds에서 questId 제거 (퀘스트 완료 상태 해제)

### UI: Undo Toast
- 위치: fixed bottom-20 (celebration toast와 겹치지 않게)
- 내용: 태스크명 + "되돌리기" 버튼
- 5초 후 자동 사라짐
- 클릭 시 uncompleteTask 호출 + toast 닫기
