# Cycle 21 — Selected Feature

## Progress Share Card (진행률 공유 카드)

**Score: 14.4**

### What
Canvas API로 예쁜 진행률 카드 이미지를 생성하고 공유/다운로드.
- 커플 이름 + D-Day
- 원형 진행 바 + 퍼센트
- 완료 퀘스트 / 전체 퀘스트
- 그라데이션 배경 + MarryRoad 워터마크
- Web Share API (모바일) / 다운로드 (데스크톱)

### Trade-offs
- (+) 바이럴 효과: SNS 공유 시 앱 인지도 상승
- (+) 감성적: 커플 이름이 들어간 카드는 기념품 느낌
- (-) Canvas 커스텀 폰트 로딩이 까다로울 수 있음 → 시스템 폰트 사용
- (-) Web Share API 미지원 브라우저 → 다운로드 폴백
