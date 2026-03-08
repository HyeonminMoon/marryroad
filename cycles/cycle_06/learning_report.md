# Cycle 6 — Learning Report

## What Worked
1. **SVG over library**: Building a custom donut chart was simpler than integrating Chart.js or Recharts. The total code is ~80 lines of SVG logic. A library would add 50KB+ to the bundle.
2. **Collapsible by default**: Making the budget chart collapsed by default was the right choice — users who haven't entered costs won't be confused by an empty chart.
3. **P1 debt cleared**: The "later" group limit was a 15-line change that meaningfully improved the dashboard UX.

## What Failed
1. **No animation**: The donut appears instantly, which feels less polished than the animated progress bars elsewhere. Should have added a grow-in effect.

## Key Insights
1. **Three practical pillars now exist**: Time (D-Day), Money (Budget), and Tasks (Quest). These cover the three most stressful aspects of wedding planning.
2. **The product is approaching feature maturity**: After 6 cycles, the core loop is solid. Future cycles should focus more on polish and integration than new features.
3. **Page complexity warning**: The roadmap page now has many sections. Before adding more, consider reorganization.

## Cumulative Product State
After 6 cycles:
1. Quest/Task Gamification (original)
2. Journey Timeline (Cycle 1)
3. Celebration Memo Toast (Cycle 2)
4. Achievement Badges + real XP (Cycle 3+4)
5. D-Day Dashboard + Header Badge (Cycle 4+5)
6. Budget Donut Chart (Cycle 6)
7. Credibility fixes (Cycle 4+5)
8. UX polish: urgency pagination, date edit (Cycle 5+6)

Three active loops:
- Emotional: task → toast → memo → journey → achievement
- Temporal: wedding date → urgency → prioritize → complete on time
- Financial: costs → budget chart → awareness → better decisions

## Next Cycle Focus
The product needs consolidation, not more features.
Recommendation: **Real streak tracking + roadmap page reorganization** — gamification polish + UX improvement.
