# Cycle 10 — Clarify Answers

1. **Current first experience**: Landing page → "시작하기" → roadmap with empty state. The user sees a complex map/quest system without context. The couple setup and wedding date are separate prompts that may be missed.

2. **Upfront info**: Couple names + wedding date. That's all we need. Budget can stay default.

3. **Warm onboarding**: A simple 2-step welcome flow:
   - Step 1: "반갑습니다! 이름을 알려주세요" (couple names)
   - Step 2: "결혼식 날짜가 정해졌나요?" (wedding date, skippable)
   - Then redirect to roadmap with everything pre-configured

This replaces the fragmented CoupleSetup + WeddingDatePicker on roadmap.

## Decision
**Welcome Onboarding Flow** — new page /welcome with 2 steps, then redirect to /roadmap.
