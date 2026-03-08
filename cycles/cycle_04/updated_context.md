# Cycle 4 — Updated Context

## Product State After Cycle 4

### Features Built
1. Quest-Task Gamification (original)
2. Wedding Journey Timeline (Cycle 1)
3. Celebration Memo Toast (Cycle 2)
4. Achievement Badge System with real XP (Cycle 3 + 4 fix)
5. D-Day Dashboard (Cycle 4)

### Active Feature Loops
```
Loop 1 (Emotional): Complete task → Toast → Memo → Journey → Achievement → Motivation
Loop 2 (Practical): Set wedding date → See urgency → Prioritize → Complete on time
```

### Known Issues & Debt
| Priority | Issue | Source |
|----------|-------|--------|
| P1 | No way to edit wedding date after setting | Cycle 4 critic |
| P1 | Streak "3일 연속" is hardcoded (credibility) | Cycle 4 critic |
| P2 | D-Day badge in header (persistent visibility) | Cycle 4 improvement |
| P2 | Smart progress bar (use first completion date) | Cycle 4 improvement |
| P2 | Limit "later" urgency group to 5 items | Cycle 4 improvement |
| P2 | Centralized completion flow (useCelebrationToast) | Cycle 2 debt |
| P3 | Custom date picker component | Cycle 4 suggestion |
| P3 | D-Day on journey timeline | Cycle 4 suggestion |
| P3 | Budget visualization (pie chart) | Cycle 3/4 suggestion |

### Recommended Next Cycle
Small-scope polish cycle: wedding date edit, streak fix, credibility audit, D-Day header badge.
