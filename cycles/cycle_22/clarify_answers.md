# Cycle 22 — Clarify Answers

1. **감지 위치**: roadmap/page.tsx에서 `progress.completedQuestIds` 변화 감시. useRef로 이전 값 저장, useEffect에서 새로 추가된 questId 감지.

2. **축하 모션**: 전체 화면 오버레이 + 대형 confetti + 퀘스트 아이콘 + "퀘스트 완료!" 텍스트 + 획득 XP 표시. 3초 후 자동 닫힘 or 클릭으로 닫기.

3. **차별화**: 기존 CelebrationToast는 태스크 단위(작은 토스트 + 메모). 이건 퀘스트 단위(전체 화면 오버레이 + 큰 축하). 위계: 태스크 완료(작은) → 퀘스트 완료(크게).

4. **XP 보상**: completeTask에서 quest.xp가 이미 부여됨 (line ~420). bulkCompleteQuest에서도 동일.
