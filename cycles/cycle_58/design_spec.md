# Cycle 58 — Design Spec
## Image Resize Utility
- `resizeImage(file, maxSize=800, quality=0.7)` → base64 data URL
- Canvas API 사용, aspect ratio 유지
- JPEG 포맷, 70% 품질 → ~50-100KB per image

## Photo Upload UI (in TaskDetailSheet)
- 위치: 메모 카드 아래, 날짜 카드 위
- 썸네일: 80x80px 그리드, rounded-lg
- 삭제: hover 시 X 버튼 (absolute top-right, bg-black/60)
- 추가: dashed border 버튼, Camera 아이콘
- 제한: 최대 3장
- 읽기 전용 모드: 삭제/추가 버튼 숨김

## Data Flow
```
FileInput → resizeImage() → photos[] state
  → onComplete({...data, photos})
    → completeTask(questId, taskId, cost, {photos, ...})
      → Zustand persist → localStorage
        → extractJourneyEvents() → JourneyCard photos display
```
