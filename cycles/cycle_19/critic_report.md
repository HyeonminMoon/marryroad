# Cycle 19 — Critic Report

## Good
1. 3중 중첩 해소: 모달 안의 인라인 폼 → 독립적 바텀 시트로 분리
2. 카드형 섹션이 정보 계층을 명확히 구분 (비용=파란색, 체크리스트=회색, etc.)
3. 태스크 카드가 클릭 가능해지면서 compact summary + chevron right로 어포던스 제공
4. 미완료 태스크에 "바로 완료" vs "기록하고 완료" 선택지 — 유저의 의도에 맞는 동선
5. formData useEffect 리셋이 task 전환 시 stale data 방지

## Issues Found

### P2: Dialog + Sheet 이중 레이어
- Dialog(모달) 위에 Sheet가 열리면서 z-index 충돌 가능성
- Radix UI가 Portal 기반이라 대부분 괜찮지만, 일부 브라우저에서 overlay 겹침 이슈
- 근본적 해결: 퀘스트 목록 자체를 페이지로 만들고 Sheet만 사용

### P2: task-detail-form.tsx가 미사용 상태로 남음
- 새 task-detail-sheet.tsx로 대체됨
- task-detail-form.tsx 삭제 필요

### P3: 바텀 시트의 드래그 닫기 없음
- 핸들 바는 시각적으로만 존재, 실제 드래그 인터랙션 없음
- 네이티브 앱 수준의 제스처는 추후 개선 사항

### P3: 만족도 별점이 모든 태스크에 노출
- "청첩장 디자인 선택" 같은 태스크에는 의미 있지만, "혼인신고서 준비" 같은 태스크에는 무의미
- 태스크 타입에 따른 조건부 표시 고려
