# Cycle 22 — Tasks

## Task 1: QuestCompletionOverlay 컴포넌트
- 전체 화면 fixed 오버레이 (z-[60])
- Framer Motion: scale(0.5→1) + opacity(0→1) 진입, opacity(1→0) 퇴장
- 대형 confetti 2회 (좌우 대칭)
- 퀘스트 아이콘, 제목, +XP 표시
- 3초 auto-dismiss 타이머 + 클릭 닫기

## Task 2: roadmap/page.tsx에서 퀘스트 완료 감지
- useRef로 이전 completedQuestIds 저장
- useEffect에서 새로 추가된 questId 감지
- QuestCompletionOverlay에 전달

## Task 3: 빌드 검증
