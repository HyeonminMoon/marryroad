# Cycle 31 — Design Spec

## Weekly Challenge

### 챌린지 종류 (자동 생성)
1. **"이번 주 N개 완료하기"** — 주간 태스크 완료 목표 (3개, 5개)
2. **"비용 기록하기"** — 이번 주 태스크에 비용 기록 1건 이상
3. **"메모 남기기"** — 이번 주 태스크에 메모 1건 이상
4. **"3일 연속 활동"** — streak 챌린지

### UI
- 로드맵 "오늘" 탭 상단에 배치
- Glass card + gradient border (purple→pink)
- 프로그레스 바 (현재/목표)
- 완료 시: confetti + 보너스 XP 배지 애니메이션
- 남은 시간 표시 (이번 주 남은 일수)

### 로직
- 매주 월요일 자동 리셋 (로컬 시간 기준)
- 이번 주 활동 데이터에서 진행률 계산
- 보너스 XP: 챌린지당 25 XP
- Zustand persist: `weeklyChallenge: { weekStart, completedChallengeIds, claimedRewards }`

### 스타일
- bg-gradient-to-r from-purple-500/10 to-pink-500/10
- 프로그레스: h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500
- 완료 배지: scale bounce 애니메이션
