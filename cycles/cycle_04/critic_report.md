# Cycle 4 — Critic Report

## What's Good
1. **Time awareness is a game-changer**: The app now has a concept of time. Tasks aren't just a checklist — they have deadlines relative to the wedding date. This is the single biggest UX improvement since the original quest system.
2. **Achievement XP fix restores credibility**: Users now see "+25 XP" and their bar actually moves. Trust restored.
3. **Urgency grouping is intuitive**: Red/amber/blue/green mapping is universally understood.

## Problems Found

### P1 — No way to edit wedding date after setting
Once set, the user has no UI to change it. If they enter the wrong date, they're stuck. Need an edit button on the countdown section.

### P2 — Streak is still hardcoded
`TodaySection` still shows "3일 연속" which is a lie. Same credibility issue we just fixed for achievements. Should either implement real streak tracking or remove the display.

### P2 — 365-day progress assumption
The time progress bar assumes 365 days of planning. If someone starts planning 6 months before, the bar starts at ~50%. Not a terrible assumption but could be smarter (use first task completion date as start).

### P3 — Date picker UX on mobile
HTML date input looks different on every browser/OS. Consider a custom calendar component for consistency.

### P3 — "later" tasks could be hidden entirely
Showing 100+ tasks in the "later" group adds visual noise. Consider showing only count, not individual tasks.

## Architectural Observations
- D-Day utility is clean and stateless — good separation
- The component is self-contained (date picker + countdown + task list in one)
- Achievement XP grant happens in a useEffect which could theoretically fire multiple times in React strict mode — but localStorage seen-check prevents double-granting

## Missing Features
- Wedding date should show in header (D-XXX badge) for constant awareness
- No integration with Journey Timeline (show D-Day relative dates on journey events)
