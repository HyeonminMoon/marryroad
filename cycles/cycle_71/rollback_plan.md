# Cycle 71 — Rollback Plan
## 위험도: LOW
모든 변경이 코드 제거 또는 신규 페이지 추가이므로 기존 기능에 영향 없음.

## 롤백 시
```bash
git revert HEAD
```
- header.tsx: 이전 커밋에서 이미 정리된 상태였으므로 영향 최소
- error.tsx, not-found.tsx: 삭제해도 Next.js 기본 에러 페이지로 폴백
