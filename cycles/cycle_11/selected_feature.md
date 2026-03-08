# Cycle 11 — Selected Feature

## Activity Heatmap (GitHub-style 잔디)

A visual 90-day activity grid showing which days the user completed tasks. Each day cell is colored by activity intensity (number of tasks completed). Placed prominently on the roadmap page.

### Why This Feature
- Uses existing `activeDates` data — zero new data infrastructure needed
- "잔디 심기" is culturally resonant with Korean 2030s (GitHub, Baekjoon, etc.)
- Creates powerful daily return motivation via visual streak psychology
- Pairs with existing streak badge to create complete engagement feedback loop

### Key Requirements
- 90-day grid (13 weeks) with month labels
- Color intensity based on tasks completed that day
- Today highlighted
- Tooltip on hover showing date + count
- Responsive: works on mobile
- Collapsible section
