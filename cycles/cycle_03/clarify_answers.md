# Cycle 3 - Clarify Answers

## 1. Behaviors to Reward
- **Task completion milestones**: First task, 10th, 50th, 100th, all 137
- **Quest completion milestones**: First quest, 5th, all 14
- **Data richness**: First memo, 10 memos, first photo
- **Budget tracking**: Setting budget, recording first cost
- **Consistency**: Using the app (streak-based)
- **Exploration**: Visiting journey page

## 2. How Many
~15 achievements is ideal. Enough to feel like a system, not so many it's overwhelming. Group into 3 tiers: Bronze (easy), Silver (medium), Gold (hard).

## 3. Where to Display
- **Achievement popup**: When newly unlocked (toast notification)
- **Profile/achievements page**: Full list with locked/unlocked state
- **Journey page**: Achievements as milestone markers
- **Roadmap header**: Badge count indicator

## 4. XP Bonus
Yes. Small XP bonus (25-100) per achievement. This reinforces the existing XP/level system.

## 5. Condition Checking
Computed from existing progress data. No separate persistence needed. On each state change, check if any new achievements are unlocked. This avoids duplication.

## 6. Persistence
**Computed, not stored.** Achievement definitions are static. Achievement unlock state is derived from progress data. Only need to track "which achievements have been shown as new" (to avoid re-showing the unlock animation).
