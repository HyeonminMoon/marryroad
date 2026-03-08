# Cycle 17 — Clarify Answers

1. **Deferred P1 bugs (2+ cycles)**:
   - Budget empty state: no edit button when no spending (Cycle 12, 14)
   - SVG gradient ID collision in ProgressRing (Cycle 12)
   - Stats tab badge for new achievements (Cycle 13, 14)
   All three are quick fixes (<30 min each).

2. **Data loss anxiety**: The #1 risk with localStorage-only apps. Users investing hours entering vendor info, costs, memos — one browser clear and it's gone.

3. **Data export/import**: Yes. Export progress as JSON file, import from file. Takes 1-2 hours to build. Gives users control over their data without needing Supabase. Classic "offline-first with manual backup" pattern.

4. **Good stepping stone**: Export/import validates the data schema for cloud sync later. If the exported JSON structure works well, it becomes the Supabase row format.

5. **Best ROI combo**: 3 quick P1 fixes (budget edit, gradient ID, stats badge) + data export/import feature. Fixes trust bugs AND adds data safety net.
