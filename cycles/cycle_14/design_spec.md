# Cycle 14 — Design Spec

## Tab Icons
Add Lucide icons to each tab label, inline with text. Icons should be small (w-4 h-4) and match text color.

## Content Transitions
Use `AnimatePresence mode="wait"` wrapping tab content. Each tab content panel gets:
- `initial={{ opacity: 0, x: direction * 20 }}`
- `animate={{ opacity: 1, x: 0 }}`
- `exit={{ opacity: 0, x: direction * -20 }}`
- Duration: 200ms

Track previous tab index to determine slide direction.

## Budget Edit
Add a `Pencil` icon button next to budget total in BudgetChart header.
On click, show inline input (same UX as the old header editor).
Store action: `setBudgetTotal` from useQuestStore.
