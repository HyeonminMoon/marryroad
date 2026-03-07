# Cycle 1 - Critic Report

## What's Good
1. **Data reuse**: The feature creates value from existing data without any store changes
2. **Emotional design**: Milestone markers + motivational messages add emotional weight
3. **Progressive disclosure**: Cards expand for details, collapsed view stays clean
4. **Responsive**: Desktop alternating layout + mobile single column

## What's Missing

### Critical
1. **Level-up events not tracked**: The current store doesn't record when level-ups happened, so we can't show them in the timeline. Need to add level-up history to QuestProgress.

2. **No "share" capability**: The biggest emotional payoff would be sharing the timeline with your partner/family. No export or share feature exists.

3. **No date input encouragement**: Many users will skip the date field in task completion (quick complete doesn't set dates). The timeline will be mostly "날짜 미기록" items, which kills the narrative flow.

### Important
4. **No photo viewing**: Photos are stored but there's no full-size viewer (just 16x16 thumbnails). Need a lightbox/zoom component.

5. **No quest color in timeline line**: The center line is a static gradient. It could dynamically change colors based on which quest's tasks are being shown.

6. **No "memory prompt"**: When completing a task, the system doesn't prompt users to add a memo. Adding a gentle nudge ("이 순간을 기록해보세요") would enrich timeline data.

### Nice to Have
7. **No print/PDF export**: Couples might want to print their journey as a wedding album page.

8. **No partner view**: Can't see what the other person has been doing.

9. **No search/filter**: Can't filter timeline by quest, date range, or keyword.

## UX Issues
1. **Empty state transition is abrupt**: After completing first task, user has to manually navigate to /journey to see it. Should add a nudge on /roadmap.
2. **No "back to top" button**: Long timelines will need scroll navigation.
3. **Desktop layout wastes space**: Alternating left/right with max-w-sm cards leaves lots of whitespace. Could use the space better.

## Architecture Issues
1. **No lazy loading**: If a user has 100+ completed tasks, all cards render at once. Should virtualize or paginate.
2. **extractJourneyEvents runs on every render**: Should be memoized with useMemo.
3. **img src from photos array**: No validation or fallback for broken image URLs.
