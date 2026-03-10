# Cycle 26 — Design Spec

## Decision Cascade UX

### 1. Selectable Option Pills
- 기존 static span → tappable button
- 선택 시: bg-purple-600 text-white + check icon (radio-style, 1개만)
- 미선택: 기존 스타일 유지
- 이전에 선택한 적 있으면 ring-2 ring-purple-300

### 2. Impact Insight Card
- 옵션 선택 시 아래로 slide-in (AnimatePresence)
- 아이콘 + 짧은 영향도 설명 (1~2줄)
- bg-gradient-to-r from-purple-50 to-pink-50

### 3. Decision Memory
- Zustand persist: `decisionSelections: Record<string, string>`
- key: `{taskId}-{checklistIdx}`, value: 선택된 옵션 텍스트
- store action: `setDecisionSelection(taskId, idx, option)`

### 4. Cross-Task Awareness
- 다른 태스크에서 이전 선택을 참조해 관련 팁 표시
- "이전 선택 기반" 배지로 context 제공

### 5. Impact Map (Static)
- 핵심 의사결정 → 영향받는 항목 매핑
- 계절 선택 → 비용, 예약 경쟁, 날씨
- 예산 범위 → 업체 등급, 옵션 범위
- 택일 방식 → 일정 유연성
