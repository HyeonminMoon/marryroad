# MarryRoad

> 결혼 준비를 게임처럼 깨세요. 137개 할 일을 19개 퀘스트로 정리한 Wedding OS.

## 주요 기능

| 기능 | 설명 |
|------|------|
| Quest-Task 시스템 | 19개 퀘스트, 137개 태스크, XP/레벨 |
| D-Day 대시보드 | 결혼식까지 남은 일수 + 긴급도 기반 태스크 정렬 |
| 예산 관리 | 도넛 차트 + 퀘스트별 지출 내역 |
| 활동 히트맵 | GitHub 잔디 스타일 90일 활동 기록 |
| 프로그레스 링 | Apple Watch 스타일 진행률 + 애니메이션 |
| 업적 시스템 | 15개 배지 (Bronze/Silver/Gold), 실제 XP 연동 |
| 스트릭 추적 | 연속 활동일 추적 + 헤더 배지 |
| 커플 프로필 | 이름 설정 + 매일 바뀌는 따뜻한 메시지 50개 |
| 여정 타임라인 | 완료한 태스크를 시간순 기록 |
| 온보딩 | 2단계 웰컴 플로우 (이름 → 날짜) |

## 빠른 시작

```bash
npm install
npm run dev
```

http://localhost:3000 접속

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/welcome` | 온보딩 (신규 유저) |
| `/roadmap` | 메인 허브 — 3탭 (오늘/퀘스트/통계) |
| `/journey` | 여정 타임라인 |
| `/calendar` | 캘린더 |
| `/database` | 데이터베이스 |

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **State**: Zustand (persist middleware, localStorage)
- **Visualization**: React Flow + Dagre
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)

## 프로젝트 구조

```
app/           — 페이지 & 라우트
components/    — React 컴포넌트
  quest/       — 퀘스트 관련 (진행률 링, 히트맵, 업적 등)
  journey/     — 여정 타임라인
  ui/          — shadcn/ui 컴포넌트
lib/
  stores/      — Zustand 스토어
  data/        — quests.json, achievements, daily messages
  types/       — TypeScript 타입 정의
  utils/       — 유틸리티 (dday, streak, budget 등)
  hooks/       — 커스텀 훅 (useCountUp 등)
cycles/        — 자율 에이전트 사이클 문서 (cycle_01 ~ cycle_14)
```

## 개발 사이클

이 프로젝트는 자율 에이전트 사이클(10-phase)로 개발됩니다.
각 사이클: Clarify → Discover → Plan → Design → Build → Test → Critique → Improve → Learn → Next

14사이클 완료. 상세: `AGENT_SYSTEM.md`, `cycles/` 폴더 참조.

## 라이센스

MIT License
