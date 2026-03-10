# Cycle 41 — Design Spec

## Changes

### CostBreakdown
- Add `onQuestClick?: (questId: string) => void` prop
- Each bar becomes clickable with hover effect + cursor-pointer

### Database page
- New state: `filterQuest: string | null`
- Pass `onQuestClick` to CostBreakdown → `setFilterQuest`
- Filter logic: add `filterQuest` to allTasks filtering
- Show active quest filter chip above table with X dismiss button
- Chip shows quest icon + title + quest color
