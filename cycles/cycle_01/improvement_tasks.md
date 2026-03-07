# Cycle 1 - Improvement Tasks (for Cycle 2+)

## Priority 1 (Cycle 2)
1. **Add "memory prompt" to quick-complete flow**: When user quick-completes a task, show a brief toast/dialog asking "한 줄 메모를 남겨보세요" with optional date input. This enriches journey timeline data.

2. **Memoize journey data extraction**: Wrap `extractJourneyEvents` and `calculateJourneyStats` in `useMemo` to prevent re-computation on every render.

3. **Add journey nudge on roadmap**: After completing a task, show a subtle link "여정 타임라인에서 확인하기" in the confetti moment or as a toast.

## Priority 2 (Cycle 3)
4. **Level-up event tracking**: Add `levelHistory: { level: number; date: string; xp: number }[]` to QuestProgress. Record when user levels up. Display in timeline.

5. **Photo lightbox**: Add react-medium-image-zoom (already in package.json!) to journey cards for full-size photo viewing.

6. **Timeline share feature**: Generate a shareable image/link of the journey summary. Could use html-to-image or a simple screenshot approach.

## Priority 3 (Cycle 4+)
7. **Print-friendly journey view**: CSS print styles for the timeline.
8. **Journey filtering**: By quest, date range, or keyword.
9. **Lazy loading / virtualization**: For users with 100+ events.
10. **Dynamic timeline line colors**: Change center line color based on quest context.

## New Feature Ideas Discovered
- **Achievement/Badge System**: "첫 번째 기록" (first memo), "사진 마스터" (10 photos), etc.
- **Journey Comparison**: Side-by-side partner journeys
- **AI Journey Summary**: Generate a narrative paragraph from timeline data
