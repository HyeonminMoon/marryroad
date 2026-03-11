# Cycle 71 — Analysis
## 런칭 전 감사 결과
| 심각도 | 이슈 | 파일 |
|--------|------|------|
| CRITICAL | /auth/login, /auth/signup 404 | header.tsx |
| CRITICAL | Supabase 데드 코드 (미설치 패키지 참조) | header.tsx |
| HIGH | 이미지 alt="" 접근성 위반 | journey-card, task-detail-sheet |
| HIGH | console.error 프로덕션 노출 | share-card-button |
| HIGH | error.tsx / not-found.tsx 미존재 | app/ |

## 수정 전략
- 헤더: Supabase 관련 코드 전체 삭제, 순수 클라이언트 네비게이션만 유지
- alt 텍스트: 컨텍스트 기반 의미 있는 설명 추가
- console.error: silent fail (사용자가 재시도 가능)
- 에러 페이지: 브랜드 일관성 유지하는 최소 UI
