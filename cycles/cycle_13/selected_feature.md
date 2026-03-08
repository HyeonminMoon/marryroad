# Cycle 13 — Selected Feature

## Tab Navigation + Mobile-First Default

### Tab Structure
1. **오늘** (default) — TodaySection + CoupleMessage
2. **퀘스트** — Quest Map (desktop) / Quest Path (mobile) + D-Day Dashboard
3. **통계** — ActivityHeatmap + AchievementGrid + BudgetChart

### Mobile-First
- Default viewMode: 'path' on mobile, 'map' on desktop
- Remove the map/path toggle buttons (auto-detect)

### Tab Bar Design
- Below the ProgressRing sticky header
- Horizontal with animated underline indicator
- Framer Motion layoutId for smooth tab switch
- Sticky alongside header for easy access while scrolling
