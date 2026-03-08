# Cycle 15 — Updated Context

## Product: POLISHED MVP (Trust-Hardened)

### Complete Feature List
1-14: All previous features (see cycle_14/updated_context.md)
15. Credibility Polish: photo placeholder removed, task data loads on reopen, completed task editing, urgency-aware today tab with badges

### Tech
Next.js 16 + TypeScript + Zustand + React Flow + Framer Motion + Tailwind

### Files Changed
- `components/quest/task-detail-form.tsx` — removed photo placeholder, added existingData prop, added edit mode for completed tasks
- `components/quest/task-modal.tsx` — passes existing data to form, allows completed task expansion
- `components/quest/today-section.tsx` — urgency-aware recommendations with getUrgentTasks + badges
