# Cycle 6 — Critic Report

## What's Good
1. **Custom SVG donut is lightweight**: No chart library dependency. The donut renders fast and looks clean.
2. **Budget section is collapsible**: Users who haven't entered costs yet won't see an empty chart taking up space.
3. **"Later" group limit solved the visual noise problem**: 100+ tasks hidden behind a simple expand.

## Problems Found

### P2 — Donut segments overlap slightly
When many small segments exist (e.g., 8+ quests with tiny costs), the rounded `strokeLinecap` causes slight visual overlap. Consider removing linecap rounding for small segments.

### P2 — No animation on donut
The donut appears instantly. A grow-in animation (like the progress bars) would feel more polished.

### P3 — Budget chart empty state isn't helpful enough
"아직 기록된 비용이 없어요" could include a hint about WHERE to enter costs (task detail form).

### P3 — Roadmap page getting long
With AchievementGrid, BudgetChart, DdayDashboard, TodaySection, and the map — the page has a lot of sections. Consider tab-based organization or collapsible sections for all.

## Architectural Observations
- Budget utility is pure and testable — good pattern
- SVG donut calculation is correct but not abstracted — if we need a second chart type, consider a shared utility
- The page now imports 8 components — getting complex but manageable
