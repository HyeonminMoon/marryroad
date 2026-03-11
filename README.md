# MarryRoad

> 결혼 준비를 게임처럼 깨세요. 137개 할 일을 14개 퀘스트로 정리한 Wedding OS.

## 주요 기능

| 기능 | 설명 |
|------|------|
| Quest-Task 시스템 | 14개 퀘스트, 137개 태스크, XP/레벨 시스템 |
| 스마트 홈 요약 | Lenny's Newsletter 기반 — 진행률 리포트, 페이스 피드백, 단일 추천 |
| D-Day 대시보드 | 결혼식까지 남은 일수 + 긴급도 기반 태스크 정렬 |
| 예산 관리 | 도넛 차트 + 카테고리별 예산 배분 + 퀘스트별 지출 추적 |
| 하객 관리 | RSVP 추적, 식사 유형, 축의금, 필터/검색 |
| 활동 히트맵 | GitHub 잔디 스타일 90일 활동 기록 |
| 프로그레스 링 | Apple Watch 스타일 진행률 + 애니메이션 |
| 업적 시스템 | 15개 배지 (Bronze/Silver/Gold), 실제 XP 연동 |
| 스트릭 추적 | 연속 활동일 추적 + 헤더 배지 |
| 의사결정 가이드 | 태스크별 체크리스트 + 선택지 + 영향도 카스케이드 |
| 커플 프로필 | 이름 설정 + 매일 바뀌는 따뜻한 메시지 50개 |
| 여정 타임라인 | 완료한 태스크를 시간순 기록 (메모, 사진, 비용, 업체 정보) |
| 진행률 공유 카드 | 예쁜 이미지 카드로 결혼 준비 현황 공유 |
| 퀘스트 숨기기 | 불필요한 퀘스트를 숨겨서 나만의 로드맵 구성 |
| 온보딩 | 2단계 웰컴 플로우 (이름 → 날짜) |
| 모바일 하단 탭 바 | 1탭 네비게이션 — 5개 핵심 페이지 즉시 접근 |

## 최근 변경 (Cycle 64~71)

### 새 기능
- **하객 관리 페이지** (`/guests`) — CRUD, RSVP, 식사 유형, 축의금 통계
- **설정 페이지** (`/settings`) — 커플 정보, 결혼식 날짜, 예산, 퀘스트 관리, 공유 카드, 데이터 관리 통합
- **카테고리별 예산 배분** — 퀘스트별 예산 설정 + 지출 대비 시각화
- **스마트 홈 요약** — Lenny's Newsletter 인사이트 적용 (outcome framing, pace feedback, single recommendation)
- **모바일 하단 탭 바** — 햄버거 메뉴(3단계) → 하단 탭(1단계)으로 마찰 극감

### UI 경량화 (Lenny 원칙 적용)
- 오늘 탭: 7개 → 4개 섹션 (SmartRecommendation, NeglectedQuests, ProgressMilestone, WeeklyProgress 제거)
- 통계 탭: 8개 → 5개 섹션 (DataManagement, ShareCard, QuestVisibility를 설정으로 이동)
- 결정 피로 제거, 핵심만 남기기

### 런칭 품질 수정
- 존재하지 않는 auth 페이지 링크 제거
- Supabase 데드 코드 정리
- error.tsx / not-found.tsx 에러 바운더리 추가
- 이미지 alt 텍스트 접근성 수정
- Outcome-framed 빈 상태 메시지 (캘린더, 데이터베이스, 하객)

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
| `/roadmap` | 메인 허브 — 오늘/퀘스트/통계 탭 |
| `/journey` | 여정 타임라인 (완료 기록) |
| `/calendar` | 캘린더 (일정 관리) |
| `/database` | 태스크 데이터베이스 (필터/정렬) |
| `/guests` | 하객 관리 (RSVP, 식사, 축의금) |
| `/settings` | 설정 (커플 정보, 날짜, 예산, 퀘스트 관리, 공유, 데이터) |

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **State**: Zustand (persist middleware, localStorage)
- **Visualization**: React Flow + Dagre
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Storage**: Client-side only (localStorage)

## 프로젝트 구조

```
app/           — 페이지 & 라우트
components/    — React 컴포넌트
  quest/       — 퀘스트 관련 (진행률 링, 히트맵, 업적, 예산 등)
  journey/     — 여정 타임라인
  ui/          — shadcn/ui 컴포넌트
lib/
  stores/      — Zustand 스토어 (quest-store, guest-store)
  data/        — quests.json, achievements, daily messages, decision impacts
  types/       — TypeScript 타입 정의 (quest, guest)
  utils/       — 유틸리티 (dday, streak, budget, share-card, image-resize)
  hooks/       — 커스텀 훅 (useCountUp 등)
cycles/        — 자율 에이전트 사이클 문서 (cycle_01 ~ cycle_71)
```

## 개발 사이클

이 프로젝트는 자율 에이전트 사이클(10-phase)로 개발됩니다.
각 사이클: Clarify → Discover → Plan → Design → Build → Test → Critique → Improve → Learn → Next

71사이클 완료. 상세: `AGENT_SYSTEM.md`, `cycles/` 폴더 참조.

## 라이센스

MIT License
