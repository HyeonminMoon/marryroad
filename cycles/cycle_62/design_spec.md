# Cycle 62 — Design Spec
## M3: Journey Date Separation
- space-y-8 → space-y-10 (그룹 간격 확대)
- 그룹 사이 gradient 구분선 (from-transparent via-purple-200 to-transparent)
- 날짜 라벨: text-xs → text-sm, px-3 py-1 → px-4 py-1.5
- 날짜 dot: 3.5→4 크기
- 이벤트 수 badge 추가 (text-[10px])

## M4: Lock Skip
- lockedMessage를 {text, questId} 객체로 변경
- toast에 "그래도 열기" 버튼 추가
- 클릭 시 해당 퀘스트의 TaskModal을 강제로 열기
- "×" 닫기 버튼 추가 (기존 setTimeout 제거)

## M6: Welcome Step 0
- 초기 step: 1 → 0
- Step 0: 앱 로고 + 제목 + 설명 + 4개 기능 소개 + "시작하기" 버튼
- 기능 목록: 퀘스트, 예산, D-Day, 여정
