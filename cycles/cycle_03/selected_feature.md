# Cycle 3 - Selected Feature

## Achievement Badge System

### Why
- Reinforces gamification loop (Cycle 1 journey + Cycle 2 memo toast)
- Rewards data richness (memos, costs) which feeds the journey timeline
- Creates "surprise and delight" moments throughout the experience
- Adds visual progression beyond the XP bar

### MVP Scope
- 12 achievements across 3 tiers (Bronze/Silver/Gold)
- Achievement unlock notification (toast)
- Achievements section on roadmap page (collapsible badge grid)
- Computed from existing progress data (no store changes for definitions)
- Track "seen" achievements in localStorage to avoid re-notification

### Achievement List
| ID | Tier | Name | Condition | XP |
|----|------|------|-----------|-----|
| first-step | Bronze | 첫 걸음 | Complete 1 task | 25 |
| memo-writer | Bronze | 기록의 시작 | Write 1 memo | 25 |
| budget-setter | Bronze | 예산 마스터 | Set budget total | 25 |
| ten-tasks | Silver | 열 번째 완료 | Complete 10 tasks | 50 |
| first-quest | Silver | 퀘스트 클리어 | Complete 1 quest | 50 |
| cost-tracker | Silver | 가계부 달인 | Record 5 costs | 50 |
| memo-collector | Silver | 이야기 수집가 | Write 10 memos | 50 |
| half-way | Gold | 절반의 성공 | Complete 50% tasks | 75 |
| five-quests | Gold | 다섯 고개 | Complete 5 quests | 75 |
| level-five | Gold | 레벨 5 | Reach level 5 | 75 |
| all-quests | Gold | 완벽한 준비 | Complete all quests | 100 |
| grand-master | Gold | 그랜드 마스터 | Complete all 137 tasks | 100 |
