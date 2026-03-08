# Cycle 17 — Selected Feature

## P1 Bug Fixes + Data Export/Import

### Part A: Quick P1 Fixes
1. **Budget empty state edit** — Show budget edit button even when no spending
2. **SVG gradient ID** — Use React `useId()` to prevent collision
3. **Stats tab badge** — Red dot on Stats tab when new achievements are unseen

### Part B: Data Export/Import
- Export: Download progress as `marryroad-backup-YYYY-MM-DD.json`
- Import: Upload JSON file to restore progress
- Location: Settings section in Stats tab or Header menu
- Includes: all progress data (tasks, costs, memos, dates, achievements, budget, wedding date, couple names)
