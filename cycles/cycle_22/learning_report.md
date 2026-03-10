# Cycle 22 — Learning Report

## What Worked
1. useRef + useEffect 패턴이 상태 변화 감지에 깔끔 — 이전 값과 현재 값 비교
2. canvas-confetti의 origin 파라미터로 좌우 대칭 burst 구현 간단
3. Framer Motion spring 물리가 "튀어나오는" 감각 자연스럽게 제공
4. 4초 auto-dismiss가 적절 — 너무 짧으면 못 보고, 길면 방해

## What Could Be Better
- 여러 퀘스트 동시 완료 시 queue가 필요 — achievement toast에서 이미 구현한 패턴 재활용 가능
- onDismiss를 useCallback으로 안정화하지 않으면 effect 재실행 가능성

## Key Insight
"소리 없는 완료"는 무의미. 게임에서 스테이지 클리어 화면이 없으면 성취감이 반감됨. 결혼 준비도 마찬가지 — "예식장 관련 준비 완료!"를 큰 화면으로 보여주는 것이 다음 퀘스트를 시작하는 원동력.

## Cumulative State (22 cycles)
- All previous features (21 cycles)
- **NEW**: Quest Completion Overlay (전체 화면 축하)
- **NEW**: 대형 confetti burst (좌우 대칭)
- **NEW**: 퀘스트 아이콘 회전 + XP bounce 애니메이션
- **NEW**: 자동 닫힘 4초 + 클릭 닫기

## Next Cycle Recommendation
- 알림/리마인더 시스템 (Notification API + 태스크 기한 기반)
- Or: 퀘스트 간 전환 애니메이션 개선 (unlock 연출)
- Or: 커플 소통 기능 (파트너에게 태스크 할당)
