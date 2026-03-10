# Cycle 31 — Learning Report

## What Worked
1. 챌린저스 패턴: 명확한 목표 + 시간 제한(1주) + 보상(XP)이 동기부여 3요소
2. activityCounts에서 주간 데이터 추출이 간단 — 기존 데이터 구조가 잘 설계되어 있었음
3. claimWeeklyReward를 별도 action으로 만들어 "수동 claim" UX 구현 — 자동 부여보다 체감이 좋음

## Key Insight
게이미피케이션의 핵심은 "자동으로 주지 말고 직접 클릭해서 받게 하는 것". 챌린저스가 잘하는 건 "돈을 돌려받는 순간의 쾌감"이고, 여기서는 "+25 XP" 버튼을 누르는 순간이 그 역할.

## Cumulative State (31 cycles)
- All previous features (30 cycles)
- **NEW**: WeeklyChallenge — 4가지 주간 챌린지 + 보상 claim + confetti
- **NEW**: weeklyChallenge state in QuestProgress (persist)

## Next Cycle Recommendation
- Vendor Compare Cards (Zola/The Knot inspired)
