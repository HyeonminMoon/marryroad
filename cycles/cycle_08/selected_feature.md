# Cycle 8 — Selected Feature

## Couple Profile + Daily Warm Message

### What
1. Let user set couple names (나의 이름 + 상대방 이름)
2. Display personalized warm message daily on roadmap page
3. Use names throughout the app (header, journey, celebrations)

### Store
- Add `coupleNames: { user: string; partner: string } | null` to QuestProgress

### Daily Message System
- Array of ~20 warm messages with `{partner}` placeholder
- Select based on day-of-year (deterministic, changes daily)
- Messages like:
  - "{partner}와(과) 함께할 내일이 기대돼요"
  - "오늘의 준비가 {partner}와(과)의 아름다운 하루를 만들어요"
  - "결혼 준비, 힘들지만 {partner} 생각하면 괜찮죠?"

### UI
- First-time setup: name input modal (optional, can skip)
- Roadmap top: daily message card with warm gradient
- Header: "현종 & 수진" text (if names set)
