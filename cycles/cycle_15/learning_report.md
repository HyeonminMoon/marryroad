# Cycle 15 — Learning Report

## What Worked
1. "Credibility polish" cycle has outsized impact — removing one placeholder + fixing data loading makes the entire app feel more trustworthy
2. Reusing `getUrgentTasks` from `dday.ts` made urgency-aware today tab trivial to implement
3. `existingData` prop pattern is clean — optional prop, zero breaking changes, backward compatible

## What Failed
- Nothing significant. Small focused fixes are low-risk.

## Key Decisions
- Chose polish over new features at cycle 15 — right timing since feature set is rich but had trust-breaking bugs
- Added edit capability for completed tasks (P1 from critique) — essential for data correction

## Cumulative State (15 cycles)
Complete Wedding OS with polished, trustworthy UX:
- All previous features (14 cycles)
- **NEW**: Photo placeholder removed (no unfinished UI exposed)
- **NEW**: Task data persists and loads when reopening (memo, vendor, cost, rating)
- **NEW**: Completed tasks editable via "수정하기" button
- **NEW**: Urgency-based task recommendations when wedding date is set
- **NEW**: Urgency badges (overdue/due-soon/upcoming) on today tab

## Next Cycle Recommendation
- Calendar page: show recommended timing as scheduled events (high practical value)
- Or: SEO/OG metadata for KakaoTalk sharing (acquisition channel)
- Or: Empty state illustrations for new users (first impression)
