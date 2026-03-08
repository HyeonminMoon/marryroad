# Cycle 13 — Clarify Answers

1. **Korean app patterns**: Toss uses horizontal scrollable tabs, Notion uses collapsible sections, Instagram uses grid/tabs at profile level. Toss's pattern is the best fit — a horizontal tab bar below the hero section.

2. **Content grouping**:
   - "오늘" tab: TodaySection + CoupleMessage (daily engagement)
   - "퀘스트" tab: Quest Map/Path view (the main task system)
   - "통계" tab: Heatmap + Achievements + BudgetChart + D-Day Dashboard (analytics)
   This reduces the initial page from 7 sections to 2-3 visible sections per tab.

3. **UI pattern**: Segmented tab bar with animated underline indicator (like Toss/카카오). Clean, zero learning curve for Korean users. Tabs are better than accordion because users can switch between views without scrolling.

4. **Mobile default**: Set viewMode to 'path' when viewport < 768px. React Flow DAG is hard to navigate on mobile.

5. **Discovery**: The tab bar itself shows all 3 sections exist. Stats tab has a "new" dot when new achievements unlock. Today tab is the default — it's the most actionable.
