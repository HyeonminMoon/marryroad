# Cycle 7 — Clarify Answers

1. **Active day** = completing at least 1 task. Page visits don't count — that's too easy and meaningless.

2. **Storage**: Store `activeDates: string[]` (ISO date strings) in QuestProgress. Array of unique dates when user completed tasks. This gives us both streak calculation and historical activity data (potential future heatmap). Max array size won't be an issue — even daily activity for a year is only 365 strings.

3. **Streak display**: Back in TodaySection, but now real. Also add it to the header alongside D-Day badge for persistent visibility.

4. **Roadmap page**: It's not critically long because BudgetChart and AchievementGrid are already collapsible. The issue is more about visual hierarchy — all sections compete for attention equally.

5. **Reorganization approach**: Instead of tabs (which hide content), improve visual hierarchy:
   - DdayDashboard stays prominent at top (most actionable)
   - TodaySection below (daily focus)
   - AchievementGrid + BudgetChart collapsed by default (reference info)
   - Map/Path view at bottom (exploration)

## Decision
- Primary: Real streak tracking with store persistence
- Secondary: Add streak to TodaySection (restored) and header
- Tertiary: Minor roadmap layout polish (visual hierarchy)
