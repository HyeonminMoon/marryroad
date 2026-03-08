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
2. 모든 사이클은 `/cycles/cycle_XX/` 폴더에 10개 문서를 모두 생성할 것 (스킵 금지)
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

## Tech Constraints
- State: Zustand with persist middleware (localStorage)
- Heavy components (React Flow): use dynamic import
- Styling: Tailwind CSS only, no CSS modules
- Animations: Framer Motion
- No backend changes without explicit need — prefer client-side first

## Build & Verify
```bash
npm run build    # must pass before committing
npm run dev      # local dev server at localhost:3000
```
