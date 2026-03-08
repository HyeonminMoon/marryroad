# Cycle 17 — Design Spec

## Fix 1: Budget Empty State
Add edit section inside `!hasSpending` branch, reuse existing edit UI pattern.

## Fix 2: SVG Gradient ID
```tsx
const gradientId = useId();
// ...
stroke={`url(#${gradientId})`}
// ...
<linearGradient id={gradientId} ...>
```

## Fix 3: Stats Tab Badge
```tsx
// Compute from already-available data
const hasNewAchievements = useMemo(() => {
  const seen = JSON.parse(localStorage.getItem('marryroad-seen-achievements') || '[]');
  return unlockedAchievementIds.some(id => !seen.includes(id));
}, [unlockedAchievementIds]);

// On stats tab click, mark all as seen
// Red dot: absolute positioned span on stats tab button
```

## Data Export Format
```json
{
  "version": 1,
  "exportDate": "2026-03-06T12:00:00Z",
  "appName": "MarryRoad",
  "data": {
    // Entire QuestProgress object from Zustand store
  }
}
```

## Data Import Flow
```
User clicks "데이터 불러오기"
  → File picker opens (accept=".json")
  → Parse JSON
  → Validate version + data shape
  → Show confirmation: "기존 데이터를 덮어쓰시겠습니까?"
  → If yes: write to quest-store, reload
  → If no: cancel
```

## UI Location
Stats tab, below BudgetChart:
```
┌─────────────────────────────┐
│ 💾 데이터 관리               │
│                             │
│ [📤 내보내기]  [📥 불러오기]  │
│                             │
│ 텍스트: 데이터를 파일로 백업  │
└─────────────────────────────┘
```
