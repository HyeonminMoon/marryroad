# Cycle 14 — Selected Feature

## Tab Icons + Content Transitions + Empty States

### Tab Icons
- 오늘: Zap (energy/action)
- 퀘스트: Gamepad2 (game/quest)
- 통계: BarChart3 (analytics)

### Content Transitions
- AnimatePresence + motion.div for tab content switching
- Slide + fade direction based on tab position (left/right)

### Empty States
- Today tab (no tasks): "아직 시작 전이에요! 퀘스트 탭에서 첫 할 일을 골라보세요"
- Stats tab (no activity): Friendly messages per section
- Budget chart (no spending): Encouraging message

### Budget Edit
- Add inline budget edit button back to BudgetChart (lost in Cycle 12)
