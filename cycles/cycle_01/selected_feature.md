# Cycle 1 - Selected Feature

## Wedding Journey Timeline (우리의 여정)

### Why This Feature
- **Highest impact+novelty at low effort** (Score: 25)
- Turns dead data (completedDate, memos, photos, ratings) into living narrative
- Creates the emotional "wow" moment no other wedding app delivers
- Zero backend changes - pure frontend feature using existing Zustand store

### Feature Summary
A beautiful, scrollable timeline page (`/journey`) that auto-generates from the user's completed task data. Each completed task becomes a "memory card" on the timeline, showing:

- Date completed
- Task/Quest name
- User's memo
- Photos (if uploaded)
- Cost spent
- Vendor info
- Rating

Milestone markers highlight major achievements (quest completions, level-ups, budget milestones).

### Success Metrics
- User visits journey page after completing 5+ tasks
- User spends >30s viewing the timeline
- User shares or screenshots the timeline

### MVP Scope
- New page: `/journey`
- Vertical timeline component
- Memory cards from completed tasks
- Quest completion milestone markers
- Overall progress summary at top
- Empty state for new users
