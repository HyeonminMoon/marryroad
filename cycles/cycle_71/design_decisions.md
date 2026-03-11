# Cycle 71 — Design Decisions
## D1: Auth 코드 완전 제거 (vs 주석 처리)
- 선택: 완전 제거
- 이유: Supabase가 설치되지 않은 상태에서 import만 있으면 빌드 실패 위험. 필요 시 git history에서 복구 가능.

## D2: error.tsx 최소 디자인
- 선택: 아이콘 + 메시지 + "다시 시도" 버튼만
- 이유: 에러 상황에서 복잡한 UI는 오히려 혼란. 단일 행동(reset)만 제공.

## D3: not-found.tsx 홈 리다이렉트
- 선택: /roadmap으로 돌아가기 버튼
- 이유: 가벼운 서비스 원칙 — 사용자가 길을 잃지 않도록 명확한 탈출구.
