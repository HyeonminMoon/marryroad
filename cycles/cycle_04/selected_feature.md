# Cycle 4 — Selected Feature

## D-Day Dashboard + Achievement XP Fix

### Problem
1. The app has no concept of time. Users don't know WHEN to do things.
2. Tasks have `recommendedTiming` data (D-365, D-180, etc.) but it's invisible.
3. Achievement XP is shown but not granted (credibility bug from Cycle 3).

### Solution: D-Day Dashboard
A new section on the roadmap page that:
1. Lets user set their wedding date (D-Day)
2. Shows a prominent countdown: "D-127"
3. Parses `recommendedTiming` from task data to compute actual target dates
4. Groups tasks by urgency: overdue / this week / this month / upcoming
5. Highlights what the user should focus on RIGHT NOW

### Achievement XP Fix
- When achievements are detected as newly unlocked, add their XP to the store
- This makes the "+25 XP" display truthful

### Success Metrics
- User sets wedding date within first session
- User visits dashboard section regularly
- Tasks are completed in timing-appropriate order (not random)

### MVP Scope
- Wedding date picker (stored in Zustand progress)
- D-Day countdown badge in header area
- "Focus Now" section: overdue + due-this-week tasks
- Urgency color coding (red/amber/green)
- Achievement XP actually granted
