# Cycle 21 — Updated Context

## Product: ALL-USER MVP

### Complete Feature List
1-20: All previous features
21. Progress Share Card: Canvas API 이미지 생성, Web Share API, 프리뷰 + 공유/다운로드

### Tech
Next.js 16 + TypeScript + Zustand + React Flow + Framer Motion + Tailwind + Canvas API

### Files Changed
- `lib/utils/share-card.ts` — NEW: Canvas 이미지 생성 + 공유/다운로드 유틸
- `components/quest/share-card-button.tsx` — NEW: 공유 카드 생성 버튼 + 프리뷰
- `app/roadmap/page.tsx` — ShareCardButton 추가 (stats 탭)
