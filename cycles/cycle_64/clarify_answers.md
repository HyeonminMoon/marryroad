# Cycle 64 — Clarify Answers
1. Zustand persist store — key: 'marryroad-guests', 기존 quest-store 패턴과 동일
2. GuestRelation: 'family' | 'friend' | 'colleague' | 'other'
3. RsvpStatus: 'confirmed' | 'declined' | 'pending' | 'maybe'
4. plusOne: boolean, getStats()에서 confirmed +1도 인원수에 포함
5. giftAmount: number (원 단위), 전체 합산 통계 제공
