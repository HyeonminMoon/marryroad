# Cycle 22 — Critic Report

## Good
1. 감성 임팩트 극대화: confetti + 아이콘 회전 + XP bounce가 "성취" 감각 제공
2. 자동 닫힘 + 클릭 닫힘 이중 처리로 방해감 최소화
3. 초기 로드 false positive 방지 (prev.length > 0)
4. spring 애니메이션이 자연스러운 물리감

## Issues Found

### P2: 여러 퀘스트 동시 완료 시 첫 번째만 표시
- Quick Setup에서 여러 퀘스트를 한번에 완료하면 하나만 축하
- Queue 시스템으로 순차 표시 고려 (achievement toast처럼)

### P3: confetti 타이머가 onDismiss에 의존
- StrictMode에서 effect가 2번 실행되면 confetti도 2번 — 프로덕션에서는 문제 없음

### P3: 오버레이가 다른 모달과 겹칠 수 있음
- z-[60]으로 최상위 배치했지만, Sheet(z-50) + Dialog 위에 정확히 렌더링되는지 확인 필요
