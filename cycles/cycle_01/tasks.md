# Cycle 1 - Tasks

## Feature: Wedding Journey Timeline

### Task 1: Create Journey data extraction utility
- Extract completed tasks from quest-store progress
- Sort by completedDate
- Attach quest metadata (title, color, icon)
- Output: sorted array of JourneyEvent objects
- **Test**: Given mock progress data, returns correctly sorted events

### Task 2: Define JourneyEvent type
- Add to lib/types/quest.ts
- Fields: date, questTitle, questColor, questIcon, taskTitle, memo, photos, cost, vendorName, rating, type (task|quest-complete|level-up)
- **Test**: TypeScript compiles without error

### Task 3: Build JourneyTimeline component
- Vertical timeline with alternating left/right cards
- Date markers on the center line
- Responsive: single column on mobile
- Uses Framer Motion for scroll-triggered animations
- **Test**: Renders with mock data, cards appear on scroll

### Task 4: Build JourneyCard component
- Shows: date, quest badge, task title, memo excerpt
- Expandable to show full memo, photos, vendor, rating, cost
- Color-coded by quest
- **Test**: Renders all data fields correctly

### Task 5: Build MilestoneMarker component
- Special visual for quest completions and level-ups
- Larger, centered on timeline
- Celebratory styling (gold border, star icon)
- **Test**: Renders differently from regular cards

### Task 6: Build JourneySummary header
- Stats: total completed tasks, days since first task, total spent, current level
- Mini progress ring
- Motivational message based on progress %
- **Test**: Calculates stats correctly from progress data

### Task 7: Create /journey page
- Wire up JourneyTimeline with real store data
- Add to header navigation
- Empty state for no completed tasks
- **Test**: Page renders, shows timeline or empty state

### Task 8: Add navigation link
- Add "여정" tab to header.tsx (both desktop and mobile)
- Use BookHeart or Route icon
- Active state styling consistent with other tabs
- **Test**: Navigation works, active state correct

### Task 9: Build empty state
- Warm illustration/message for users with 0 completed tasks
- CTA: "첫 번째 퀘스트를 시작해보세요" linking to /roadmap
- **Test**: Shows when no tasks completed, links work
