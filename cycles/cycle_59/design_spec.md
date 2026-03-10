# Cycle 59 — Design Spec
## Budget Edit Button
- Before: `text-[11px] text-gray-400` + Pencil 3x3
- After: `text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg` — pill 형태

## Default Budget Nudge Banner
- 조건: `totalBudget === DEFAULT_BUDGET && !editingBudget`
- 스타일: amber-50 배경, Settings 아이콘, "기본값(3,000만원)" 메시지
- 인터랙션: 탭하면 바로 편집 모드 진입
