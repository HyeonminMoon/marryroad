# Cycle 38 — Design Spec

## Component: JourneyFilter

### Props
- quests: Quest[] (이벤트가 있는 퀘스트만)
- events: JourneyEvent[] (이벤트 카운트용)
- selectedQuestId: string | null (null = 전체)
- onSelect: (questId: string | null) => void

### UI
- 수평 스크롤 칩 바 (snap-x)
- "전체" 칩 (기본 선택, 이벤트 총 수 표시)
- 퀘스트별 칩: quest icon + title + event count
- 선택된 칩: quest color 배경, 미선택: glass
- Sticky 위치: summary 아래, timeline 위

### Filter Logic (Journey page)
- selectedQuestId === null → 모든 이벤트
- selectedQuestId !== null → events.filter(e => e.questId === id)
