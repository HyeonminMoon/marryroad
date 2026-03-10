# Cycle 19 — Tasks

## Task 1: TaskDetailSheet 컴포넌트 생성
- Sheet (side="bottom") 기반 태스크 상세 뷰
- 상단: 태스크 헤더 (제목, 상태 배지, 추천 시기, 소요 시간)
- 체크리스트 섹션 (있는 경우)
- 카드형 섹션: 비용, 메모, 업체 정보, 평점 — 각 섹션이 독립 카드
- 하단 고정: 완료/수정 버튼
- 완료된 태스크: 읽기 모드 (데이터 표시), "수정하기" 토글로 편집
- 미완료 태스크: 바로 편집 모드

## Task 2: TaskModal에서 인라인 폼 제거, Sheet 연동
- renderTaskItem에서 인라인 폼 부분 제거
- 태스크 카드 클릭 or "상세" 버튼 → TaskDetailSheet 열기
- 완료된 태스크의 compact summary는 유지 (간략 정보)

## Task 3: 빌드 검증
- npm run build
