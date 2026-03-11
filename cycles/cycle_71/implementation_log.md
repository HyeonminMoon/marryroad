# Cycle 71 — Implementation Log
## T1: header.tsx Supabase 제거
- Removed: createClient, getUser, onAuthStateChange, signOut, login/signup links
- Removed: DropdownMenu, Avatar, Badge, Bell, LogOut imports
- Removed: user dropdown, notification bell
- Result: Clean header with logo + badges + desktop nav only, h-16 → h-14

## T2-T3: Image alt text
- journey-card.tsx: `alt=""` → `alt={\`${event.taskTitle} 사진 ${i + 1}\`}`
- task-detail-sheet.tsx: `alt=""` → `alt={\`첨부 사진 ${i + 1}\`}`

## T4: console.error removal
- share-card-button.tsx: `console.error(...)` → silent catch block

## T5-T6: Error pages
- app/error.tsx: Client component with reset button, branded design
- app/not-found.tsx: Static page with home redirect button
