# Cycle 10 — Design Spec

## /welcome page
```
Step 1:                          Step 2:
┌──────────────────┐            ┌──────────────────┐
│  💍               │            │  📅               │
│                  │            │                  │
│  반갑습니다!      │            │  결혼식 날짜가    │
│                  │            │  정해졌나요?      │
│  [나의 이름    ] │            │                  │
│  &               │            │  [날짜 선택기]    │
│  [상대방 이름  ] │            │                  │
│                  │            │  [설정]  [나중에] │
│  [다음]          │            │                  │
└──────────────────┘            └──────────────────┘
```

## Flow
1. New user → homepage → "시작하기" → /welcome
2. Complete step 1 (names) → step 2 (date)
3. Skip or complete step 2 → redirect /roadmap
4. Returning user → homepage auto-redirect /roadmap (existing logic)

## No login required
All data in localStorage via Zustand persist.
