# Cycle 3 - Learning Report

## What Worked
1. **Computed > Stored**: Achievement state derived from progress data is elegant. No migration needed, no sync issues.
2. **Tiered system**: Bronze/Silver/Gold creates natural progression goals.
3. **Queue pattern**: Simple ref-based queue for sequential toast display works well.

## What Failed
1. **XP display without XP grant**: Saying "+25 XP" without actually granting it is misleading. Should have either implemented the grant or omitted the display.
2. **First-visit edge case not considered**: Existing users will get flooded with toasts. Should have designed for this.

## Key Insights
1. **Feature credibility matters**: If you show "+25 XP", it MUST actually give 25 XP. Users trust UI text. Breaking that trust damages the entire gamification system.
2. **Retroactive unlock UX**: When adding a new feature that retroactively checks state, the first-visit experience is fundamentally different from ongoing use. Design for both.
3. **The cycle system works**: Each cycle builds on the previous. Cycle 1 (journey) needed data -> Cycle 2 (memo toast) collects data -> Cycle 3 (achievements) rewards data collection. The features form a coherent loop.

## Architecture Notes
- Achievement definitions in a separate file (lib/data/achievements.ts) is clean. Easy to add new achievements.
- The "seen" tracking via localStorage is simple but could conflict with the main store's localStorage. Fine for now.

## Cumulative Product State
After 3 cycles, the app has:
- Quest/Task gamification (original)
- Journey Timeline (Cycle 1)
- Celebration Memo Toast (Cycle 2)
- Achievement Badge System (Cycle 3)

These form a reinforcing loop:
Complete task -> Celebration toast prompts memo -> Memo enriches journey -> Achievement unlocks reward behavior -> User motivated to complete more tasks

## Next Cycle
Fix the first-visit flood issue (Priority 1 from improvements), then move to either:
- D-Day Dashboard (practical value)
- Budget visualization (financial clarity)
