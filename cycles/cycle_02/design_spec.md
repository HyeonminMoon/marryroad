# Cycle 2 - Design Spec

## Feature: Celebration Memo Toast

### User Flow
1. User quick-completes a task (TodaySection or TaskModal)
2. Confetti fires (existing)
3. 300ms delay, then CelebrationToast slides up from bottom
4. Toast shows: "축하! [task title] 완료" + memo input
5. User either:
   a. Types a memo and hits Enter/Submit -> memo saved, toast slides down
   b. Does nothing for 6 seconds -> toast auto-slides down
   c. Clicks "건너뛰기" -> toast slides down immediately
6. If 5+ tasks completed, a subtle "여정에서 보기" link appears

### Interface Concept

```
┌──────────────────────────────────────┐
│  (rest of the app)                    │
│                                       │
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ✅ "택일 방식 결정" 완료!         │  │
│  │                                   │  │
│  │ ┌─────────────────────────────┐ │  │
│  │ │ 한 줄로 기록해볼까요?       │ │  │
│  │ └─────────────────────────────┘ │  │
│  │                                   │  │
│  │ [저장]              [건너뛰기]  │  │
│  │ ═══════════░░░░░░░░░░░░ 3s     │  │
│  │     여정에서 확인하기 →          │  │
│  └─────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Data Flow

```
Quick Complete (existing)
    │
    ├── completeTask(questId, taskId) [existing]
    │   └── sets completedDate = today
    │
    └── triggers CelebrationToast
         │
         ├── user types memo + submits
         │   └── updateTaskMemo(questId, taskId, memo)
         │       └── progress.taskProgress[questId].taskExtendedData[taskId].memo = memo
         │
         └── user skips / auto-dismiss
             └── no action needed
```

### Component Props

```typescript
interface CelebrationToastProps {
  visible: boolean;
  questId: string;
  taskId: string;
  taskTitle: string;
  onSaveMemo: (memo: string) => void;
  onDismiss: () => void;
  showJourneyLink: boolean;
}
```

### Store Addition

```typescript
// In quest-store.ts
updateTaskMemo: (questId: string, taskId: string, memo: string) => void;
```
