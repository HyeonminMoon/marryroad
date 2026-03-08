# Cycle 15 — Design Spec

## 1. Remove Photo Placeholder

**File**: `components/quest/task-detail-form.tsx`
- Delete lines 237-246 (photo placeholder block)
- Remove `Camera` from lucide-react import

## 2. Load Existing Task Data

**File**: `components/quest/task-detail-form.tsx`
- Add `existingData` prop: `{ cost?: number; memo?: string; date?: string; vendorInfo?: TaskExtendedData['vendorInfo']; rating?: number }`
- Initialize `formData` state from `existingData` when provided

**File**: `components/quest/task-modal.tsx`
- In `renderTaskItem`, build existing data from `userCost` and `extData` (already available)
- Pass to `TaskDetailForm` as `existingData` prop
- Also allow completed tasks to expand form in read-only mode (view saved data in form layout)

### Data Flow
```
quest-store.progress.taskProgress[questId]
  → taskCosts[taskId] → cost
  → taskExtendedData[taskId] → memo, completedDate, vendorInfo, rating
    ↓
TaskModal reads these (already does for display)
    ↓
Pass as existingData prop to TaskDetailForm
    ↓
TaskDetailForm initializes formData from existingData
```

## 3. Urgency-Aware Today Tab

**File**: `components/quest/today-section.tsx`
- Modify `getRecommendedTasks` to accept optional `weddingDate`
- When `weddingDate` exists, use `getUrgentTasks` from `dday.ts` to get urgency-sorted tasks
- Take first 3 urgent tasks instead of sequential first-available
- Add urgency badge on task cards: overdue (red), due-soon (orange), upcoming (blue)

### Urgency Badge Colors
```
overdue   → bg-red-100 text-red-700    "지금 해야 해요!"
due-soon  → bg-orange-100 text-orange-700  "곧 마감"
upcoming  → bg-blue-100 text-blue-700     "다가오는 일정"
later     → no badge (default)
```
