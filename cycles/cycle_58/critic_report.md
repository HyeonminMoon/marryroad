# Cycle 58 — Critic Report
## Problem Solved
H1 — 사진 업로드 UI 부재. 이제 태스크 완료 시 사진을 첨부할 수 있고, Journey 타임라인에서 자동 표시됨.

## Trade-off
base64 → localStorage 저장은 용량 제한(~5MB)이 있음.
→ 하지만 3장 제한 + 800px 리사이즈 + 70% 압축으로 사진당 ~80KB, 총 ~240KB 수준으로 현실적.
→ 추후 Supabase Storage 연동 시 URL 기반으로 마이그레이션 가능.
