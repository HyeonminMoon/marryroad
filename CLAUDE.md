# MarryRoad (Wedding OS) — Project Instructions

## Language
- 코드 주석, 커밋 메시지: 영어
- 사이클 문서(cycles/): 한국어 + 영어 혼용 가능
- UI 텍스트: 한국어

## Agent System
이 프로젝트는 자율 에이전트 사이클로 운영됩니다.
**반드시 `AGENT_SYSTEM.md`를 읽고 그 지침에 따라 작업하세요.**

핵심 규칙:
1. 새 사이클을 시작하기 전에 이전 사이클의 `learning_report.md`와 `improvement_tasks.md`를 반드시 읽을 것
2. 모든 사이클은 `/cycles/cycle_XX/` 폴더에 필요한 문서를 모두 생성할 것 (스킵 금지, 구조는 AGENT_SYSTEM.md 참조)
3. 구현 후 반드시 `npm run build` 로 빌드 검증할 것
4. 사이클당 1 커밋: `feat: <기능 요약>`
5. 한 사이클 끝나면 즉시 다음 사이클 시작 — 멈추지 말 것

## Project Structure
```
/app          — Next.js pages & routes
/components   — React components
/lib          — utilities, stores, data, types
/scripts      — build/transform scripts
/cycles       — agent cycle documents (cycle_01, cycle_02, ...)
/public       — static assets
```

## Mobile Navigation
- 모바일: 하단 탭 바 (`components/mobile-bottom-nav.tsx`) — 5개 탭 (홈, 여정, 캘린더, 하객, 설정)
- 데스크탑: 헤더 네비 (`components/header.tsx`)
- 새 페이지 추가 시 하단 패딩 적용 필수: `pb-20 md:pb-0`

## Tech Constraints
- State: Zustand with persist middleware (localStorage)
- Heavy components (React Flow): use dynamic import
- Styling: Tailwind CSS only, no CSS modules
- Animations: Framer Motion
- No backend — client-side only (localStorage), Supabase 코드 사용 금지
- Error boundaries 필수: `app/error.tsx`, `app/not-found.tsx` 유지
- 프로덕션에 `console.log`/`console.error` 금지
- 이미지 `alt` 속성 필수 (접근성)

## Build & Verify
```bash
npm run build    # must pass before committing
npm run dev      # local dev server at localhost:3000
```

## Agent Coding Guidelines (QA Lessons Learned)

3차 QA를 통해 발견된 에이전트 실수 패턴과 방지책.

### 1. useEffect 콜백 안정성
- **문제**: useEffect deps에 인라인 콜백(예: `onDismiss`)을 넣으면 매 렌더마다 재실행됨 (타이머 리셋 등)
- **해결**: `useRef`로 최신 콜백을 보관하고, useEffect deps에서 제거
```tsx
const onDismissRef = useRef(onDismiss);
useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);
// useEffect deps에서 onDismiss 제거, onDismissRef.current() 호출
```

### 2. Zustand persist merge — 중첩 객체 보호
- **문제**: persist의 기본 merge는 shallow merge → 중첩 객체(budget 등)가 통째로 덮어써짐
- **해결**: merge 함수에서 중첩 객체를 수동 deep merge
```ts
budget: { ...currentState.progress.budget, ...(persistedState.progress?.budget || {}) }
```

### 3. localStorage 키 일관성
- **문제**: Zustand persist `name`과 실제 사용하는 키가 불일치하면 export/import 깨짐
- **해결**: 키를 상수로 정의하고, persist name과 data-io에서 동일 상수 참조

### 4. 전역 기능 추가 시 모든 페이지 점검
- **문제**: `hiddenQuestIds` 같은 전역 필터를 추가했는데 일부 페이지에만 적용
- **해결**: 퀘스트를 표시하는 모든 페이지(roadmap, journey, calendar, database)에서 필터 적용 확인

### 5. Export/Import 견고성
- 항상 try-catch로 감싸기
- Import 후 파생값(budget.spent 등) 재계산
- 버전 마이그레이션(v1→v2) 지원

### 6. localStorage QuotaExceededError
- localStorage에 쓰는 모든 곳에서 QuotaExceededError 처리
- Zustand persist: `createJSONStorage`에서 setItem을 try-catch로 래핑

### 7. SSR/CSR Hydration
- **문제**: useState 초기값에서 localStorage를 읽으면 hydration mismatch
- **해결**: useState는 기본값으로 초기화, useEffect에서 localStorage 읽어 setState

### 8. 파생 상태 일관성
- 태스크 완료/취소 시 관련 퀘스트 상태도 재계산 (`calculateQuestStatus`)
- XP 차감 시 퀘스트 보너스 XP까지 고려
- `uncompleteTask` 시 activeDates/activityCounts 복원

### 9. 병렬 에이전트 작업 시 충돌 방지 (QA/대규모 수정 시)
- 에이전트별 수정 파일을 명시적으로 분리 (겹치는 파일 금지)
- 공유 파일(quest-store.ts 등)은 한 에이전트만 담당

### 10. 데이터 정리 (메모리 관리)
- activityCounts: 90일 초과 항목 trim
- completedWeeks: 52주 초과 항목 trim
- resetProgress: 관련 localStorage 키(prevLevel, seen-achievements 등) 모두 제거
