# Cycle 8 — Design Spec

## Store
```typescript
coupleNames: { user: string; partner: string } | null
```
Action: `setCoupleNames(user: string, partner: string)`
Preserved on reset.

## Daily Messages
Deterministic selection: `messages[dayOfYear % messages.length]`
Template strings with `{partner}` and `{user}` placeholders.

## CoupleSetup Component
- Two text inputs: "나의 이름", "상대방 이름"
- Warm UI with heart icon
- "나중에" skip button
- Appears at top of roadmap when names not set

## DailyMessage Component
- Warm gradient card
- Daily rotating message with partner name
- Small, non-intrusive, but emotionally impactful
