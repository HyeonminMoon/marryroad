# Cycle 21 — Test Report

## Build
- `npm run build` ✅ 통과

## Functional Tests
1. ✅ "만들기" 버튼 클릭 → Canvas로 이미지 생성
2. ✅ 프리뷰 다이얼로그에 이미지 표시
3. ✅ 커플 이름 있을 때 "현종 ♥ 영희" 표시
4. ✅ 커플 이름 없을 때 이름 영역 생략
5. ✅ D-Day 계산: 양수(미래), 0(당일), 음수(지남) 처리
6. ✅ 웨딩 날짜 없을 때 D-Day 영역 생략
7. ✅ 진행률 원형 바: 0~100% 범위
8. ✅ Web Share API 지원 시 공유, 미지원 시 다운로드 폴백
9. ✅ 다운로드 버튼: Blob → URL → anchor download
10. ✅ 다이얼로그 닫을 때 URL.revokeObjectURL 호출 (메모리 정리)

## Edge Cases
- ✅ 퀘스트 0개일 때 (progressPercent = 0)
- ✅ 모든 퀘스트 완료 시 (100%)
- ✅ coupleNames가 null일 때
- ✅ weddingDate가 null일 때
