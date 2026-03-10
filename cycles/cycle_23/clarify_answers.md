# Cycle 23 — Clarify Answers

1. **메인 비주얼**: 퀘스트 경로(모바일 기본 뷰) + 오늘 탭 상단. 사용자가 가장 많이 보는 화면.

2. **현재 문제점**:
   - 버블이 단순한 원형 + 단색 그라데이션 — 플랫하고 깊이감 없음
   - 커넥터 라인이 단순 bezier + 단색 — 경로감이 약함
   - 잠긴 노드가 opacity 0.5로 처리 — 너무 칙칙하고 "언락하고 싶다"는 느낌 없음
   - StarBurst 애니메이션이 과하지도, 매력적이지도 않은 애매한 수준

3. **다크모드 호환**: 글래스모피즘은 다크모드에서 `bg-white/10 backdrop-blur`로 처리. 글로우는 `box-shadow`로 밝은 톤 유지.

4. **성능**: CSS `box-shadow`, `backdrop-filter`, `animation`은 GPU 가속. Framer Motion의 `animate` prop은 이미 사용 중이므로 추가 부하 미미.
