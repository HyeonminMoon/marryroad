# Cycle 30 — Design Spec

## Toss-style Budget Insight

### Layout (항상 펼쳐진 대시보드)
1. **Header**: "예산 인사이트" + 총 사용액 big number
2. **도넛 차트**: 기존 유지, animated entry
3. **카테고리 바**: 가로 프로그레스 바 + 금액 + 예산 대비 %
4. **인사이트 메시지**: 상황별 자동 메시지
   - 예산 50% 이하: "순조로워요 👍"
   - 예산 50~80%: "조금씩 주의해주세요"
   - 예산 80% 이상: "예산에 가까워지고 있어요"
   - 초과: "예산을 초과했어요"
5. **Top 지출 하이라이트**: 가장 많이 쓴 카테고리 강조

### 스타일
- Glass card 패턴
- 프로그레스 바: quest color, rounded-full, animated width
- 인사이트: gradient bg card
