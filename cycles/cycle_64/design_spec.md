# Cycle 64 — Design Spec

## 타입 시스템 (`lib/types/guest.ts`)
```typescript
GuestSide: 'groom' | 'bride'
GuestRelation: 'family' | 'friend' | 'colleague' | 'other'
RsvpStatus: 'confirmed' | 'declined' | 'pending' | 'maybe'
MealType: 'standard' | 'vegetarian' | 'none'

Guest: { id, name, side, relation, rsvp, meal, plusOne, phone?, memo?, giftAmount?, createdAt }
GuestStats: { total, confirmed, declined, pending, groomSide, brideSide, totalGiftAmount, mealCounts }
```

## Store (`lib/stores/guest-store.ts`)
- Zustand persist, key: 'marryroad-guests'
- Actions: addGuest, updateGuest, removeGuest, getStats

## 페이지 (`app/guests/page.tsx`)
### 레이아웃
1. **상단 통계 카드** — 총 인원, 참석 확정, 미정, 불참 (4칸 그리드)
2. **신랑/신부측 비율 바** — 양쪽 비율 시각화
3. **검색 + 필터** — 이름 검색, 측(groom/bride/shared/all) + RSVP 상태 필터
4. **하객 추가/수정 폼** — Sheet(모달)에서 name, side, relation, rsvp, meal, plusOne, phone, memo 입력
5. **하객 목록** — 카드 형태, 수정/삭제 버튼
6. **식사 요약** — 일반식/채식/식사안함 카운트

### 스타일
- Glassmorphism 카드 패턴
- 신랑측: blue, 신부측: pink
- 반응형 (모바일 1열, 데스크톱 2열)
