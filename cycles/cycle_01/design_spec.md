# Cycle 1 - Design Spec

## Feature: Wedding Journey Timeline (/journey)

### User Flow
1. User completes tasks on /roadmap (existing flow)
2. User clicks "여정" in navigation header
3. /journey page loads, extracts completed task data from store
4. Timeline renders with memory cards sorted by date
5. User scrolls through their wedding preparation story
6. User can expand cards to see full details

### Interface Concept

```
+--------------------------------------------------+
|  Header: 💍 MarryRoad  [홈] [여정*] [캘린더] [DB] |
+--------------------------------------------------+
|                                                    |
|  ┌──────────── Journey Summary ────────────┐      |
|  │  🎯 32/137 완료  📅 45일째  💰 850만원   │      |
|  │  [████████░░░░░] 23%                     │      |
|  │  "벌써 이만큼 왔어요! 조금만 더 힘내세요" │      |
|  └──────────────────────────────────────────┘      |
|                                                    |
|  2025.12.15                                        |
|     ┌─────────────────┐                            |
|     │ 🏠 기획 & 예산   │                            |
|     │ 택일 방식 결정    │                            |
|     │ "가족들이랑 상의해│                            |
|     │  서 결정함"       │                            |
|     │ 💰 0원           │                            |
|     └────────┬────────┘                            |
|              │                                     |
|  2025.12.18  │                                     |
|              │  ┌─────────────────┐                |
|              │  │ 🏠 기획 & 예산   │                |
|              │  │ 전체 예산 수립    │                |
|              │  │ "3000만원으로 설정│                |
|              │  │  하기로 했다"     │                |
|              │  │ 💰 0원           │                |
|              └──┴─────────────────┘                |
|              │                                     |
|  ═══════════╪══════════════════════════             |
|  ⭐ Quest 1 완료! "기획 & 예산" +100 XP            |
|  ═══════════╪══════════════════════════             |
|              │                                     |
|  2026.01.05  │                                     |
|     ┌────────┴────────┐                            |
|     │ 💒 상견례         │                            |
|     │ ...               │                            |
|     └─────────────────┘                            |
|                                                    |
+--------------------------------------------------+
```

### Mobile (single column, cards full width)
```
  2025.12.15
  ┌───────────────────────┐
  │ 🏠 기획 & 예산         │
  │ 택일 방식 결정          │
  │ "가족들이랑..."        │
  └───────────────────────┘
       │
  2025.12.18
  ┌───────────────────────┐
  │ 🏠 기획 & 예산         │
  │ 전체 예산 수립          │
  └───────────────────────┘
```

### Data Structures

```typescript
// New type
interface JourneyEvent {
  type: 'task' | 'quest-complete' | 'level-up';
  date: string;              // YYYY-MM-DD
  questId: string;
  questTitle: string;
  questColor: string;
  questIcon: string;
  // For task events
  taskId?: string;
  taskTitle?: string;
  memo?: string;
  photos?: string[];
  cost?: number;
  vendorName?: string;
  rating?: number;
  // For quest-complete events
  xpEarned?: number;
  // For level-up events
  newLevel?: number;
}

// Extraction function signature
function extractJourneyEvents(
  quests: Quest[],
  progress: QuestProgress
): JourneyEvent[]
```

### System Architecture

```
quest-store (existing)
    │
    ├── progress.taskProgress[questId].taskExtendedData[taskId]
    │   └── { completedDate, memo, vendorInfo, rating, photos }
    │
    ├── progress.taskProgress[questId].taskCosts[taskId]
    │
    └── progress.completedQuestIds
         │
         ▼
extractJourneyEvents() ── new utility function
         │
         ▼
/journey page
    ├── JourneySummary (stats header)
    ├── JourneyTimeline (scrollable container)
    │   ├── JourneyCard (task event)
    │   ├── JourneyCard (task event)
    │   ├── MilestoneMarker (quest complete)
    │   ├── JourneyCard (task event)
    │   └── ...
    └── EmptyState (when no events)
```

### Animation Plan
- Cards: fade-in + slide-up on scroll (IntersectionObserver or Framer Motion whileInView)
- Milestone markers: scale-in with slight bounce
- Timeline line: draws progressively as user scrolls
- Summary stats: count-up animation on mount
