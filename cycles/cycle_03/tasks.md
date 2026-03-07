# Cycle 3 - Tasks

### Task 1: Define achievement data + checker utility
- Static achievement definitions (id, name, tier, description, condition function, xp)
- `checkAchievements(progress, quests)` -> returns unlocked achievement IDs
- Pure function, no side effects

### Task 2: Create AchievementBadge component
- Small badge with icon, name, tier-based coloring
- Locked state (grayscale, ?)
- Unlocked state (colorful, icon visible)
- Tier colors: Bronze=#CD7F32, Silver=#C0C0C0, Gold=#FFD700

### Task 3: Create AchievementGrid component
- Collapsible grid showing all achievements
- Shows X/12 unlocked count
- Locked badges show "?" with hint text
- Unlocked badges show full info

### Task 4: Create AchievementUnlockToast component
- Celebratory notification when new achievement unlocked
- Shows badge icon, name, XP earned
- Auto-dismisses after 4 seconds
- Can stack (show multiple)

### Task 5: Wire into RoadmapPage
- Add AchievementGrid below sticky header or in a dedicated section
- Check for new achievements on progress change
- Show unlock toast when new achievement detected
- Track "seen" achievements in localStorage

### Task 6: Add achievement count to header
- Small badge count next to user avatar or as separate indicator
- Shows unlocked/total count
