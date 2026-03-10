# Cycle 61 — Design Spec
## M1: QuestComparison Click
- Optional `onQuestClick?: (quest: Quest) => void` prop
- 각 행에 hover 스타일: bg-gray-50, rounded-lg, cursor-pointer
- 클릭 시 TaskModal 열림 (기존 onQuestClick 재사용)

## M2: Heatmap Date Click
- `selectedDate` state
- 활동 있는 날짜 셀에 cursor-pointer
- 클릭 시 ring-2 ring-blue-500 표시
- 하단 패널: 날짜 + 완료 수 표시 (purple-50 배경)
- 재클릭 시 deselect

## M5: Memo Textarea
- min-h-[80px] → min-h-[120px]
