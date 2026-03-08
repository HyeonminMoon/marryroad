# Cycle 13 — Design Spec

## Tab Navigation

### Layout Structure
```
┌─ Header (sticky, z-50) ──────────────────┐
├─ ProgressRing (sticky, z-10) ────────────┤
├─ Tab Bar (sticky, z-10, below ring) ─────┤
│  [ 오늘 ]  [ 퀘스트 ]  [ 통계 ]           │
│   ───── (animated underline)              │
├──────────────────────────────────────────┤
│  Tab Content (scrollable)                 │
└──────────────────────────────────────────┘
```

### Tab States
- `activeTab: 'today' | 'quests' | 'stats'`
- Default: 'today'
- Persist in sessionStorage (not localStorage — reset per session)

### Tab Content

**오늘 tab**:
- CoupleMessage / CoupleSetup
- TodaySection

**퀘스트 tab**:
- D-Day Dashboard
- Quest Path (mobile) or Full Map (desktop)
- View toggle only visible on desktop

**통계 tab**:
- ActivityHeatmap
- AchievementGrid
- BudgetChart

### Mobile Detection
- `useMediaQuery('(min-width: 768px)')` or simple `window.innerWidth` check
- On mobile: always show QuestPath, hide FullMapView entirely
- On desktop: show FullMapView by default, toggle to QuestPath optional

### Tab Bar Component
- Flex row, equal width
- Active tab: bold text + purple underline (layoutId animation)
- Inactive: gray text
- Part of the sticky section (combine with ProgressRing div)
