# Cycle 5 — Learning Report

## What Worked
1. **Polish cycles are valuable**: Not every cycle needs a big feature. Trust and consistency matter as much as functionality.
2. **Credibility audit pattern**: "Fix one, grep all" — when you find one fake value, audit the entire app. Found and fixed streak + budget in one pass.
3. **Shared constants prevent drift**: Extracting DEFAULT_BUDGET means the store and achievement system can never disagree on what "default" means.

## What Failed
1. **Didn't limit "later" group**: Knew from Cycle 4 this was needed but deprioritized. Should have included it — it's 5 lines of code.

## Key Insights
1. **The header is prime real estate**: D-Day badge in the header is arguably the most impactful UI change per line of code. Users see it on every page. Lesson: before building a new component, ask "can this info go in the header?"
2. **Remove > Fix for fake data**: When you don't have time to implement real streak tracking, removing the fake display is better than keeping it. Absence is honest; a lie is not.

## Architecture Notes
- lib/constants.ts pattern works well for shared configuration values
- Header now imports from quest-store — acceptable coupling since the header is a global component

## Cumulative Product State
After 5 cycles:
1. Quest/Task Gamification (original)
2. Journey Timeline (Cycle 1)
3. Celebration Memo Toast (Cycle 2)
4. Achievement Badges + real XP (Cycle 3+4)
5. D-Day Dashboard (Cycle 4)
6. Credibility Polish (Cycle 5): D-Day header badge, date edit, streak fix, budget constant

Two active loops:
- Emotional: task → toast → memo → journey → achievement → motivation
- Practical: wedding date → urgency → prioritize → complete on time

## Next Cycle Focus
New feature cycle. Top candidates:
1. **Budget Visualization** (donut chart): practical value, visually appealing, moderate effort
2. **Real Streak Tracking**: gamification, data-backed, moderate effort
3. **Couple Sharing**: highest impact but highest effort

Recommendation: **Budget Visualization** — it's the next "practical value" feature that complements D-Day Dashboard. Users need to see where their money goes.
