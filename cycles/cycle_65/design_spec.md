# Cycle 65 — Design Spec

## 페이지 구조 (`app/settings/page.tsx`)

### 섹션 1: 커플 정보
- 내 이름 / 상대방 이름 입력 필드
- "저장" 버튼 → setCoupleNames 호출

### 섹션 2: 결혼식 날짜
- date input → setWeddingDate 호출
- 현재 설정된 날짜와 D-day 표시

### 섹션 3: 예산
- 총 예산 입력 (만원 단위)
- 현재 지출 / 남은 예산 표시
- setBudgetTotal 호출

### 섹션 4: 데이터 관리
- 전체 초기화 버튼 (확인 다이얼로그 포함)
- resetProgress 호출

### 스타일
- 각 섹션을 카드로 구분
- Glassmorphism 패턴
- 저장 시 성공 피드백 (체크 아이콘 + 텍스트)
