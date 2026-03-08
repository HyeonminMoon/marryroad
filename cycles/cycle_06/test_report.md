# Cycle 6 — Test Report

## Build: PASS

## T1: Budget Utility
- [x] `getSpendingByQuest` returns correct per-quest amounts
- [x] Sorted by amount descending
- [x] Percentages sum to ~100% (rounding)
- [x] Empty progress returns empty array

## T2: Budget Chart Component
- [x] SVG donut renders with correct segments
- [x] Center text shows spent/total
- [x] Legend shows colored dots + amounts + percentages
- [x] Remaining budget shows green (positive) or red (negative)
- [x] Empty state: "아직 기록된 비용이 없어요" message
- [x] Collapsible with animation

## T3: Roadmap Integration
- [x] BudgetChart placed below AchievementGrid
- [x] Shows in both map and path view modes
- [x] Max-width constrained in map view

## T4: "Later" Group Limit
- [x] Shows max 5 tasks for "later" and "upcoming" groups
- [x] "N개 더 보기" button when more exist
- [x] "접기" button after expanding
- [x] Overdue and due-soon groups always show all tasks

## Edge Cases
- [x] No spending data → empty state message
- [x] Single quest spending → full donut ring
- [x] Budget exceeded → red "예산 초과" text
