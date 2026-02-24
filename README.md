# 💍 MarryRoad

> 결혼 준비를 게임처럼 즐겁게! Quest 시스템으로 복잡한 웨딩 플래닝을 간단하게.

## 🎯 핵심 기능

### Quest-Task 2-Tier System
- **19개 Quest** (큰 카테고리) - 메인 캔버스에 표시
- **137개 Task** (세부 체크리스트) - Quest 클릭 시 모달로 표시
- **종속성 시각화** - "왜 이걸 지금 해야 하는지" 명확히

### 게임화된 경험
- 🏆 XP & 레벨 시스템
- 🎉 Task 완료 시 Confetti 효과
- 📊 실시간 진행률 추적
- �� 예산 관리 기능

---

## 🚀 빠른 시작

### 설치 및 실행
```bash
cd web
npm install
npm run dev
```

### 접속
- **홈페이지**: http://localhost:3000
- **로드맵**: http://localhost:3000/roadmap

---

## 📁 프로젝트 구조

```
marryroad/
├── web/
│   ├── app/
│   │   ├── page.tsx              # 홈페이지
│   │   ├── roadmap/
│   │   │   └── page.tsx          # 메인 로드맵 캔버스
│   │   └── api/                  # API 라우트
│   ├── components/
│   │   ├── quest/                # Quest 시스템 컴포넌트
│   │   │   ├── quest-node.tsx    # Quest 노드 카드
│   │   │   └── task-modal.tsx    # Task 체크리스트 모달
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   └── header.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   ├── quests.json       # 19개 Quest + 137개 Task
│   │   │   ├── stages.json       # 원본 스테이지 데이터
│   │   │   └── dependencies.json
│   │   ├── stores/
│   │   │   └── quest-store.ts    # Zustand 상태 관리
│   │   ├── types/
│   │   │   └── quest.ts          # Quest/Task 타입 정의
│   │   └── supabase/             # Supabase 클라이언트
│   └── scripts/
│       └── transform-seed-to-quests.js  # 데이터 변환 스크립트
├── seed_data.sql                 # 원본 웨딩 데이터
├── marryroad_past/               # 이전 버전 (참고용)
└── IMPLEMENTATION_SUMMARY_V2.md  # 구현 상세 설명
```

---

## 🎮 사용 방법

### 1. 첫 Quest 시작
1. 로드맵 페이지 접속
2. 파란색 노드 = **시작 가능** ✨
3. 회색 노드 = **잠김** 🔒 (선행 Quest 완료 필요)

### 2. Task 완료
1. Quest 노드 클릭
2. Task 체크리스트 확인
3. Task 완료 → 🎉 Confetti!
4. 비용 입력 (선택사항)

### 3. 다음 Quest 잠금 해제
- 모든 Task 완료 → Quest 완료
- 연결된 다음 Quest 자동 언락
- XP 획득 & 레벨업

---

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State**: Zustand
- **Canvas**: React Flow
- **Layout**: Dagre
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)

---

## 📊 데이터 구조

### Quest
```typescript
{
  id: string              // "1", "2", ...
  title: string           // "결혼 준비 기획 & 예산 관리"
  icon: string            // Lucide icon name
  color: string           // Hex color
  xp: number              // 100
  dependencies: string[]  // ["1"] (prerequisite Quest IDs)
  tasks: Task[]           // 세부 작업 목록
}
```

### Task
```typescript
{
  id: string              // "1.1.1"
  title: string           // "택일 방식 결정"
  priority: "상"|"중"|"하"
  recommendedTiming: string  // "D-365"
  checklist: ChecklistItem[]
  isOptional: boolean
  typicalCostMin?: number
  typicalCostMax?: number
}
```

---

## 🔄 데이터 변환

seed_data.sql → quests.json 변환:
```bash
cd web
node scripts/transform-seed-to-quests.js
```

**변환 결과:**
- ✅ 137개 stages → 19개 Quests
- ✅ 순환 참조 버그 4개 자동 제거
- ✅ Quest 레벨 종속성만 유지

---

## 🎯 핵심 비전

> **"강제하지 않는 순서(유연성)" + "게임 같은 성취감(동기부여)"**

- **Quest 레벨**: 종속성 엄격 (선행 조건 필수)
- **Task 레벨**: 자유롭게 완료 가능
- **게임화**: XP, 레벨, 진행률, 시각적 피드백

---

## 📝 주요 개선사항

### Before (문제점)
- ❌ 137개 노드 → 압도감
- ❌ 복잡한 종속성 + 순환 참조 버그
- ❌ 2개 UI (로드맵/스킬트리) 혼재
- ❌ "왜 이걸 지금 해야 하는지" 불명확

### After (해결책)
- ✅ 19개 Quest → 간결한 캔버스
- ✅ 버그 제거 + 로직 단순화
- ✅ 단일 통합 UI
- ✅ 종속성 화살표로 이유 시각화

---

## 📄 라이센스

MIT License

---

## 💕 제작

Made with GitHub Copilot CLI
