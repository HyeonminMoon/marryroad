# Cycle 21 — Design Spec

## Canvas Layout (1080 x 1080)
```
┌──────────────────────────────────┐
│      gradient background         │
│                                  │
│        커플 이름                  │
│      "현종  ♥  영희"             │
│                                  │
│        ┌──────┐                  │
│        │ 68%  │  ← 원형 진행 바  │
│        └──────┘                  │
│                                  │
│     "우리의 결혼 준비"            │
│                                  │
│    8 / 14 퀘스트 완료             │
│                                  │
│      D-120                       │
│                                  │
│                                  │
│   ─────────────────────          │
│   MarryRoad • Wedding OS         │
└──────────────────────────────────┘
```

## Util: lib/utils/share-card.ts
```typescript
export async function generateShareCard(params: {
  coupleName?: { user: string; partner: string };
  progressPercent: number;
  completedQuests: number;
  totalQuests: number;
  dDay?: number; // negative = past
}): Promise<Blob>
```

## Component: ShareCardButton
- Location: 통계 탭, DataManagement 위
- Flow: 버튼 클릭 → 이미지 생성 (로딩) → 프리뷰 모달 → 공유/다운로드
- Web Share API: `navigator.share({ files: [file] })`
- Fallback: `<a download>` 링크
