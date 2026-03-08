# Cycle 5 — Clarify Answers

1. **Credibility audit results**:
   - Streak "3일 연속" in TodaySection: hardcoded `const streakDays = 3` (line ~104). FAKE.
   - Budget default 30000000: used in achievement check `p.budget.total !== 30000000`. Works but fragile.
   - No other fake display values found.

2. **Wedding date edit**: No. Once set, there's no edit button. Must add one.

3. **D-Day in header**: Yes. The countdown is the most important number for a wedding planner. It should be always visible.

4. **Streak display**: Remove it entirely for now. Implementing real streak tracking is overkill for this cycle. A fake number is worse than no number.

5. **Minimal polish set**:
   - Fix wedding date editing (add edit button to countdown)
   - Remove fake streak display
   - Add D-Day badge to header
   - Extract budget default to constant

These are all small, focused changes that dramatically improve trust and polish.
