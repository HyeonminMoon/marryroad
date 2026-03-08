# Cycle 4 — Clarify Answers

1. **First-visit flood**: The existing fix (roadmap:82-84) partially works — shows only the best achievement when seen is empty and 3+ new. But it doesn't show a summary count like "4개의 업적을 달성했어요!". Acceptable for now, but should be polished later.

2. **Achievement XP**: Grant it. The credibility issue from Cycle 3 is real. Users see "+25 XP" and expect their XP bar to move. This is a trust-breaking bug. **Fix in this cycle.**

3. **Highest impact feature**: D-Day Dashboard. Reason: every couple has a wedding date (D-Day). Everything in wedding planning is relative to this date. A dashboard that shows "D-180: 이번 주에 해야 할 것" is the single most practical feature. It turns the abstract quest list into a time-aware action plan.

4. **D-Day Dashboard scope (MVP)**:
   - Wedding date input (stored in Zustand)
   - D-Day countdown display
   - Tasks grouped by recommended timing relative to D-Day
   - "This week" focus view: what should be done now based on D-Day
   - Visual urgency indicators (overdue, due soon, upcoming)

5. **Streak**: Not this cycle. The hardcoded value is misleading (same credibility issue as XP), but it's lower priority than D-Day. Add to P2 backlog.

6. **Mobile**: The app is already somewhat mobile-friendly (Tailwind responsive classes). Not a priority for this cycle.

## Cycle 4 Decision
**Primary**: D-Day Dashboard with wedding date input
**Secondary fix**: Grant achievement XP in store (P2 debt from Cycle 3)
