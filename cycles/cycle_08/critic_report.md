# Cycle 8 — Critic Report

## Good
1. **Emotional layer added**: First feature that addresses the "why" of wedding prep, not just the "what"
2. **Low effort, high emotional impact**: 20 messages + name substitution creates personalized experience
3. **Graceful degradation**: Works without names ("소중한 사람" fallback)

## Problems
- P2: coupleSetupDismissed resets on page refresh (useState, not persisted). Should use localStorage.
- P2: No way to edit couple names after setting
- P3: Only 20 messages — will repeat after 20 days. Should have 30-50.
- P3: Messages are purely text. Could add occasional emoji animations for special messages.
