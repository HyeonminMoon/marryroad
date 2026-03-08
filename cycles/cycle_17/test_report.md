# Cycle 17 — Test Report

## Build
- `npm run build` ✅

## Fix 1: Budget Empty State ✅
- Empty state now shows "총 예산 설정하기" button with Pencil icon
- Inline edit works (number input + 만원 unit + check button)
- Current budget displayed below as reference
- Enter/Escape keyboard shortcuts work

## Fix 2: SVG Gradient ID ✅
- `useId()` generates unique ID per component instance
- `stroke={url(#${gradientId})}` correctly references the unique gradient
- No hardcoded `progressGradient` ID remains

## Fix 3: Stats Tab Badge ✅
- `hasNewAchievements` computed by comparing unlocked vs seen in localStorage
- Red dot (w-2 h-2 bg-red-500) rendered on Stats tab when unseen achievements exist
- Only visible when Stats tab is NOT active (`activeTab !== 'stats'`)
- Clicking Stats tab updates localStorage seen list

## Data Export ✅
- `exportData()` reads localStorage, wraps in versioned JSON envelope
- Downloads as `marryroad-backup-YYYY-MM-DD.json`
- Includes version, exportDate, appName fields for validation

## Data Import ✅
- File picker accepts `.json` only
- Validates: appName === 'MarryRoad', version is number, progress has required fields
- Shows confirmation dialog before overwriting
- On success: saves to localStorage, reloads page after 1.5s
- On error: shows error feedback for 3s

## Data Management UI ✅
- Located in Stats tab below BudgetChart
- Clean card with HardDrive icon + description
- Two buttons: 내보내기 (Download) / 불러오기 (Upload)
- Animated confirmation dialog and success/error feedback
