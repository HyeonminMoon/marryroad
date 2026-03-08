# Cycle 11 — Critic Report
## Good
- Heatmap uses existing activeDates data — zero infrastructure cost
- Cultural fit: "잔디 심기" is immediately recognizable to Korean 2030s
- Longest streak stat adds competitive motivation
- Backward compatible with existing persisted data (fallback to {})
- Today highlight with purple ring is visually clear

## Problems
- P3: activityCounts not trimmed to 90 days — will grow unbounded over time (same pattern as activeDates before Cycle 9)
- P3: No achievement tied to heatmap (e.g., "30일 잔디" badge)
- P3: Mobile touch doesn't trigger hover tooltip — consider tap/long-press
- P3: Could show total tasks completed (not just active days) as a stat
