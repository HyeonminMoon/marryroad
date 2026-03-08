# Cycle 16 — Clarify Answers

1. **Calendar with recommended timing** creates the most practical value. The calendar page is currently underutilized — it's a read-only log. Adding recommended timing transforms it into a planning tool that answers "when should I do what?"

2. **Very impactful**. Korean 2030s couples plan weddings 6-12 months ahead. A calendar showing "D-180: 예식장 계약" on the actual date is the core value proposition of a wedding planner. Currently this data exists (`recommendedTiming` field) but isn't visualized temporally.

3. **OG metadata is premature**. The app needs a deployed URL first (currently localhost only). Defer to when we deploy.

4. **Empty states are P3**. Functional improvements > cosmetic ones at this stage.

5. **P2 issues** (urgency badge overflow, stats tab badge indicator) are minor. Skip for now.

**Decision**: Calendar recommended timing overlay — transform the calendar from a completion log into a wedding planning timeline.
