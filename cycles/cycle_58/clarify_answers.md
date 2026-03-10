# Cycle 58 — Clarify Answers
1. 현재 없음. 메모는 텍스트만 가능하고 사진 첨부 UI가 없음.
2. 있음. `TaskExtendedData.photos?: string[]`로 이미 정의되어 있고, store에서도 저장 가능.
3. 있음. `journey-card.tsx`에서 photos 배열을 16x16 타일로 렌더링하는 코드가 이미 존재.
→ 결론: 데이터 파이프라인은 완비, UI 입력부만 추가하면 됨.
