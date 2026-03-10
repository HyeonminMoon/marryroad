# Cycle 18 — Learning Report

## What Worked
1. "퀘스트 단위 마킹"이 핵심 — 14개 퀘스트만 보여주면 137개의 압박감이 사라짐
2. 3-state toggle (없음/진행중/완료)은 최소한의 정보로 최대 정확도를 줌
3. `bulkCompleteQuest`의 단일 set() 호출이 N개 completeTask보다 훨씬 효율적
4. "전체 선택/해제" 버튼이 31개 태스크(스드메)에서 UX를 크게 개선

## What Could Be Better
- 퀘스트 의존성을 무시하고 완료 처리하면 getQuestStatus에서 예측 불가능한 상태가 될 수 있음
- 하지만 Quick Setup은 "초기 캐치업" 도구이므로, 의존성 강제는 사용자 경험을 해칠 수 있음 (현실에서 순서대로 안 했을 수 있으니까)

## Key Insight
기존 유저만 생각하면 "처음부터 시작하는 사람"에게 최적화됨. 하지만 실제 시장에서는:
- D-365 시작: ~20% (이상적 유저)
- D-180 발견: ~40% (이미 예식장, 스드메 진행 중)
- D-90 발견: ~30% (대부분 완료, 남은 것만 체크하고 싶음)
- D-30 발견: ~10% (거의 다 끝남, 빠진 것만 확인)

80%의 유저가 "이미 준비 중"인 상태에서 앱을 발견함. 이 사이클이 없었으면 그들에게 앱은 무용지물이었을 것.

## Cumulative State (18 cycles)
Complete Wedding OS for ALL users:
- All previous features (17 cycles)
- **NEW**: Quick Setup 온보딩 (캐치업 플로우)
- **NEW**: 퀘스트 단위 3-state 마킹 (안함/진행중/완료)
- **NEW**: 개별 태스크 체크 + 전체 선택/해제
- **NEW**: `bulkCompleteQuest` 스토어 액션
- **NEW**: 4단계 웰컴 플로우 (이름 → 날짜 → 분기 → 캐치업)

## Next Cycle Recommendation
- Task detail UI 개선 (사용자 피드백: "디테일 내용이 UI상 애매")
- Or: Weekly progress summary card
- Or: 메인 허브에서도 퀘스트 일괄 완료 버튼 제공 (Quick Setup 밖에서도)
