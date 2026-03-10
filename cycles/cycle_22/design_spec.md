# Cycle 22 — Design Spec

## Component: QuestCompletionOverlay
```tsx
interface QuestCompletionOverlayProps {
  quest: Quest | null; // null = hidden
  onDismiss: () => void;
}
```

## Visual Layout
```
┌──────────────────────────────────┐
│   (semi-transparent backdrop)    │
│                                  │
│         ┌────────────┐           │
│         │   [ICON]   │           │
│         └────────────┘           │
│                                  │
│       퀘스트 완료!               │
│    "예식장 관련 준비"            │
│                                  │
│       +150 XP                    │
│                                  │
│    [아무 곳이나 터치하세요]       │
└──────────────────────────────────┘
```

## Animation
1. Backdrop: opacity 0→1 (300ms)
2. Card: scale 0.5→1 + opacity 0→1 (500ms, spring)
3. XP text: delay 500ms, slideUp + opacity
4. Confetti: 2 bursts at 0ms and 500ms
5. Auto-dismiss at 4000ms with opacity 1→0

## Detection Logic (roadmap/page.tsx)
```
prevCompletedRef = useRef(completedQuestIds)
useEffect:
  newIds = current.filter(id => !prev.includes(id))
  if newIds.length > 0:
    show overlay for newIds[0]
    prevRef.current = current
```
