# Cycle 18 — Design Spec

## Store: `bulkCompleteQuest`
```typescript
bulkCompleteQuest: (questId: string) => void;
// Implementation: iterate quest.tasks, add all to completedTaskIds
// Grant TASK_XP per task + quest.xp bonus
// Set completedDate to today for each task's extendedData
// Add quest to completedQuestIds
// Update activeDates, activityCounts
```

## Welcome Flow (4 Steps)
```
Step 1: 커플 이름
Step 2: 결혼 날짜
Step 3: "이미 준비 중인 항목이 있나요?"
  → "처음 시작해요" → /roadmap
  → "이미 준비 중이에요" → Step 4
Step 4: Quick Setup (퀘스트 캐치업)
  → "설정 완료" → /roadmap
```

## Quick Setup UI
```
┌─────────────────────────────────────┐
│  어디까지 했는지 알려주세요            │
│  빠르게 체크하고 남은 것만 집중하세요    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 💒 예식장  [안함] [진행중] [완료] │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 📸 스드메  [안함] [진행중] [완료] │    │
│  │   ↳ ☑ 스튜디오 촬영 완료       │    │ ← "진행 중" 선택 시 확장
│  │   ↳ ☐ 드레스 최종 선택        │    │
│  │   ↳ ☑ 메이크업 예약           │    │
│  └─────────────────────────────┘    │
│  ...                                │
│                                     │
│  선택한 항목: 45개 태스크 완료 처리    │
│  [설정 완료 →]                       │
└─────────────────────────────────────┘
```

## 3-State Toggle Design
- "안 했어요": gray, default
- "진행 중": blue outline, shows task list
- "다 했어요": green filled with checkmark

## Data Flow
```
User toggles quests in Step 4
  → selections stored in local state
  → "설정 완료" clicked
  → For each "다 했어요" quest: bulkCompleteQuest(questId)
  → For each "진행 중" quest: completeTask(questId, taskId) per checked task
  → Navigate to /roadmap
```
