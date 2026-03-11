# Cycle 70 — Design Spec

## MobileBottomNav 컴포넌트
```
┌─────────────────────────────────────┐
│  홈    여정   캘린더   하객   설정   │
│  🏠    📖    📅     👤    ⚙️    │
└─────────────────────────────────────┘
```

### 스타일
- md 미만에서만 표시 (`md:hidden`)
- fixed bottom-0, z-50
- 배경: bg-white/95 backdrop-blur border-t
- 활성 탭: purple-600 + font-bold
- 비활성 탭: gray-400
- safe area: `pb-[env(safe-area-inset-bottom)]`

### 헤더 변경
- 모바일 햄버거 메뉴(Sheet) 제거
- 데스크톱 네비게이션은 유지

### 콘텐츠 패딩
- 모바일에서 하단 패딩 추가 (pb-20) — 하단 탭에 가리지 않도록
