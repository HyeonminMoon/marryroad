# Cycle 1 - Clarify Answers

## 1. #1 Pain Point
The system collects rich data (dates, costs, vendors, memos, ratings, photos) per task but **never surfaces it back to the user as a meaningful narrative**. After completing 50 tasks, there's no way to see "our wedding journey so far." It's a checklist that forgets.

## 2. Missing Emotional Moment
**No celebration of the journey itself.** You complete tasks, get XP, level up - but there's no "look how far we've come" moment. No story. No timeline. No memories page. The emotional payoff is transactional (confetti) rather than cumulative (narrative).

## 3. Unused Data Gold Mine
- `completedDate` - exists per task but only shown in calendar view (scattered)
- `vendorInfo` (name, contact) - stored but never aggregated
- `rating` (1-5 stars) - collected but never visualized
- `memo` - personal notes that disappear into task modals
- `photos` - stored but never compiled
- `budget spent` - tracked but no trend visualization

**Insight**: We're sitting on a rich dataset that could power a **Wedding Journey Timeline** - the single most emotionally impactful feature we could build.

## 4. User Profile (Assumed)
- Korean couple, late 20s-30s
- One partner is the "planner" driving the app
- They want to feel organized AND celebrate progress together
- They'll show the timeline to each other, family, friends

## 5. Time-Waster Analysis
- Vendor comparison across tasks (no aggregated vendor view)
- No D-day countdown with context (what should be done by when)
- Budget tracking exists but no "are we on track?" signal

## 6. Making It Feel Alive
**A Wedding Journey Timeline** that:
- Auto-generates from completed task data
- Shows milestones with dates, photos, memos
- Creates a visual narrative of the wedding preparation journey
- Can be shared or viewed together as a couple

## 7. Competitive Edge
No Korean wedding app gamifies + narrativizes the prep journey. This is a blue ocean.

## 8. Feasibility
High. We only need:
- New page: `/journey`
- New component: timeline visualization
- Data source: existing `progress.taskProgress` with extendedData
- No backend changes needed
