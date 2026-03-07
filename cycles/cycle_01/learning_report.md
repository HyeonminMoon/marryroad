# Cycle 1 - Learning Report

## What Worked Well
1. **Data-first approach**: Analyzing existing data before designing UI revealed that the system already collects enough data for a rich timeline. No backend changes needed.
2. **Component decomposition**: Breaking the feature into JourneySummary, JourneyCard, MilestoneMarker, JourneyTimeline, JourneyEmpty made implementation fast and each piece testable.
3. **Framer Motion whileInView**: Scroll-triggered animations add polish with minimal code.
4. **Build-first validation**: Running `npm run build` after each major change caught issues early.

## What Failed / Could Be Better
1. **Quick-complete bypasses rich data collection**: The most common task completion path (quick complete button) doesn't prompt for date or memo. This means most timeline entries will lack the data that makes them meaningful. This is the #1 product issue.
2. **No real user testing**: We built based on assumptions. Need to see actual users interact.
3. **Level-up events are impossible without store changes**: Should have checked store capabilities before designing the level-up milestone feature.

## Key Insights
1. **The "data collection" problem is upstream**: The journey timeline is only as good as the data users put in. The real feature to build is making data input frictionless and rewarding.
2. **Emotional features need data richness**: A timeline of "Task X completed" with no dates/memos is not emotional. The system needs to encourage storytelling at the point of completion.
3. **Mobile-first matters**: Most wedding planning happens on phones. The alternating left/right desktop layout is nice but the mobile single-column is what most users will see.

## Process Improvements
- Start with data audit before feature design (worked great this cycle)
- Add a "data dependency check" to feature planning: does this feature need data the system doesn't currently collect well?
- Build in 2 parallel tracks: the feature itself AND the data collection UX that feeds it

## Architecture Learnings
- Zustand store's persist middleware means we can't easily add computed/derived fields. Keep extraction utilities separate (lib/utils/journey.ts pattern is good).
- Framer Motion's whileInView + viewport.once is the ideal pattern for timeline-type UIs.
- React Flow dynamic import pattern should be applied to other heavy components too.

## Next Cycle Focus
**Priority**: Improve the task completion UX to collect richer data (dates, memos). This is the upstream fix that makes the journey timeline actually work.
