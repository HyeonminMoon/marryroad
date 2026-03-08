# Cycle 16 — Selected Feature

## Calendar Planning Timeline

Transform `/calendar` from a completion log into a proactive planning tool by overlaying task recommended timing dates.

### Core Behavior
- When `weddingDate` is set: calculate actual target dates from each task's `recommendedTiming` (e.g., D-180 = weddingDate - 180 days)
- Show these as "planned" events on the calendar alongside "completed" events
- Different visual treatment: planned (dashed outline, future color) vs completed (solid, green)
- Click on a planned event → navigate to that quest's modal

### Why This Feature
- `recommendedTiming` data exists for all 137 tasks but is only shown as a badge in task details
- Calendar page exists but is underused (only shows completed dates)
- Korean 2030s couples need to see "when should I do what?" at a glance
- Reinforces the D-Day system — connects time pressure to specific actions
