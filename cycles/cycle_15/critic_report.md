# Cycle 15 — Critic Report

## Good
1. Photo placeholder removal is clean — no dead code left
2. `existingData` prop pattern is simple and backward-compatible (optional prop)
3. Urgency badge colors follow established design system (red/orange/blue)
4. `getUrgentTasks` reuse from `dday.ts` avoids code duplication

## Issues Found

### P1: No way to edit completed task data
- Completed tasks show the form in disabled state, but users can't re-enable editing
- If a user entered wrong vendor info, they're stuck
- **Fix**: Add an "수정하기" button for completed tasks that enables form editing

### P2: Urgency badge text may overflow on narrow screens
- "지금 해야 해요!" is 8 chars — on very narrow mobile screens with long quest titles, it might get clipped
- **Fix**: Use shorter text on small screens or truncate quest title more aggressively

### P3: `getRecommendedTasks` returns tasks with urgency "later" which show no badge
- When wedding date is set but all urgent tasks are "later", the today tab looks identical to no-wedding-date mode
- Minor: users might not realize urgency is active
- Not worth fixing now — functional behavior is correct
