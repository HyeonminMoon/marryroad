# Cycle 4 — Tasks

## Achievement XP Fix
- [x] T1: Add `grantAchievementXp` action to quest-store
- [x] T2: Call it from roadmap page when new achievements detected
- [x] T3: Verify XP bar updates after achievement unlock

## D-Day Dashboard
- [x] T4: Add `weddingDate` field to QuestProgress type
- [x] T5: Add `setWeddingDate` action to quest-store
- [x] T6: Create `lib/utils/dday.ts` — parse recommendedTiming, compute target dates, urgency classification
- [x] T7: Create `components/quest/dday-dashboard.tsx` — wedding date picker + countdown + urgency task list
- [x] T8: Integrate DdayDashboard into roadmap page
- [x] T9: Run `npm run build` to verify
