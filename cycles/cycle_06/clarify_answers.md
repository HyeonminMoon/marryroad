# Cycle 6 — Clarify Answers

1. **Available budget data**:
   - `progress.budget.total`: user-set total budget
   - `progress.budget.spent`: running total of all costs
   - `progress.taskProgress[questId].taskCosts[taskId]`: individual cost per task
   - This gives us per-quest spending breakdown.

2. **Visualization approach**: By quest category is most useful. Users want to know "How much went to the venue? How much to photography?" A donut/ring chart with quest breakdown.

3. **Chart library**: Custom SVG. No need for a full chart library for one donut. Keeps bundle size small. SVG donut via `stroke-dasharray` is simple and well-understood.

4. **Location**: Section on the roadmap page, near the budget summary area. Not a new page — it should be visible alongside existing content.

5. **P1 fix**: Yes, limit "later" group to 5 items with expand. Include in this cycle.

## Cycle 6 Decision
- Primary: Budget donut chart with quest-level spending breakdown
- Secondary: Fix P1 "later" group limit
