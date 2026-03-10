# Cycle 19 — Design Spec

## User Flow
```
퀘스트 모달 → 태스크 카드 클릭 → 바텀 시트 슬라이드 업
                                    ├── 헤더 (제목 + 배지)
                                    ├── 체크리스트
                                    ├── [비용 카드]
                                    ├── [메모 카드]
                                    ├── [업체 카드]
                                    ├── [평점 카드]
                                    └── [완료 버튼 / 수정 버튼]
```

## Component: TaskDetailSheet
```tsx
interface TaskDetailSheetProps {
  task: Task | null;
  quest: Quest;
  isCompleted: boolean;
  existingData?: { cost, memo, date, vendorInfo, rating };
  open: boolean;
  onClose: () => void;
  onComplete: (taskId, data) => void;
  onQuickComplete: (taskId) => void;
}
```

## Layout (Bottom Sheet)
- Sheet side="bottom" (모바일), 높이: snap to content, max 85vh
- 내부 스크롤: overflow-y-auto
- 상단 핸들 바 (8px wide, 4px height, rounded, centered)
- 각 섹션: bg-gray-50 rounded-xl p-4 with icon header

## Section Cards
1. **체크리스트** (prerequisiteNote 포함) — task.checklist.length > 0 일 때만
2. **비용** — showCost일 때만. 평균 범위 표시, 입력 필드
3. **메모** — 항상 표시. textarea
4. **업체 정보** — 접힌 상태 기본, 펼치면 이름/연락처/웹사이트/주소
5. **만족도** — 별 5개 레이팅

## State Transitions
- 미완료 → 모든 필드 편집 가능, 하단에 "완료하기" 버튼
- 완료(읽기) → 데이터 표시 모드, 하단에 "수정하기" 버튼
- 완료(편집) → 필드 편집 가능, 하단에 "저장하기" + "취소" 버튼

## Files Changed
- `components/quest/task-detail-sheet.tsx` — NEW (기존 task-detail-form.tsx 대체)
- `components/quest/task-modal.tsx` — 인라인 폼 제거, Sheet 연동
