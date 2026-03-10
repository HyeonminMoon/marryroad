# Cycle 51 — Design Spec
## 변경 후 오늘 탭 순서
1. CoupleMessage (유지)
2. SmartRecommendation (상승)
3. TodaySection (상승 — 핵심!)
4. NeglectedQuests (유지, 조건부)
5. **접이식 섹션: "활동 인사이트"**
   - DailyStreak
   - ProgressMilestone
   - WeeklyProgress
   - WeeklyChallenge

## 접이식 구현
- 기본: 접힌 상태 (한 줄 요약만 표시)
- 클릭 시 펼침
- localStorage로 상태 기억
- AnimatePresence로 부드러운 전환
