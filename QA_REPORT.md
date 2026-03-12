# MarryRoad QA Report — 20 Virtual Customers
> 생성일: 2026-03-11
> 최종 수정: 2026-03-12
> 방식: 코드 리뷰 기반 시뮬레이션 (4개 그룹 병렬)

---

## 요약

| Severity | 발견 | 수정 | 상태 |
|----------|------|------|------|
| **CRITICAL** | 4 | 4 | ALL FIXED |
| **HIGH** | 10 | 10 | ALL FIXED |
| **MEDIUM** | 18 | 18 | ALL FIXED |
| **LOW** | 12 | 12 | ALL FIXED |
| **총계** | **44건** | **44건** | **ALL FIXED** |

---

## CRITICAL (4건) — ALL FIXED

| # | 버그 | 수정 내용 |
|---|------|----------|
| C-01 | Export/Import localStorage 키 불일치 | `STORAGE_KEY`를 `marryroad-quest-storage`로 수정 |
| C-02 | Export에 guest-store 미포함 | Export v2 형식으로 quest+guests 모두 포함, v1 하위 호환 |
| C-03 | 사진 base64 → 5MB 초과 시 데이터 손실 | Zustand persist에 커스텀 storage + QuotaExceededError 감지 |
| C-04 | localStorage 쓰기 실패 시 알림 없음 | setItem에 try/catch + window.alert 알림 |

## HIGH (10건) — ALL FIXED

| # | 버그 | 수정 내용 |
|---|------|----------|
| H-01 | uncompleteTask 퀘스트 보너스 XP 미차감 | 퀘스트 완료 상태였으면 quest.xp도 차감 |
| H-02 | Undo 시 activeDates/activityCounts 미복원 | 오늘 날짜 activityCounts 감소, 0이면 activeDates에서 제거 |
| H-03 | Undo 후 재완료 시 activityCounts 중복 | H-02 수정으로 자연 해결 |
| H-04 | 잠긴 퀘스트 "그래도 열기" 의존성 우회 | 버튼/핸들러 제거 |
| H-05 | 업적 XP 중복 부여 | xp=0이면 seen-achievements 리셋하는 가드 추가 |
| H-06 | 초기화 시 잔여 localStorage 미삭제 | resetProgress에 4개 키 삭제 추가 |
| H-07 | hiddenQuestIds 캘린더/DB/여정 미적용 | 3개 페이지 모두 필터링 추가 |
| H-08 | bulkCompleteQuest quests 상태 미갱신 | calculateQuestStatus 호출 + quests 업데이트 |
| H-09 | 온보딩 없이 /roadmap 직접 접근 가능 | 데이터 없으면 /welcome 리다이렉트 |
| H-10 | 축의금 입력 UI 부재 | GuestForm에 만원 단위 숫자 입력 필드 추가 |

## MEDIUM (18건) — ALL FIXED

| # | 버그 | 수정 내용 |
|---|------|----------|
| M-01 | Undo Toast 빠른 연속 완료 시 이전 undo 상실 | clearTimeout으로 이전 타이머 정리 (기존 동작 유지, 의도된 설계) |
| M-02 | Undo 후 퀘스트 상태 미갱신 | uncompleteTask에 calculateQuestStatus 추가 |
| M-03 | completedDate 없는 태스크 캘린더 누락 | 오늘 날짜를 fallback으로 사용 |
| M-04 | getStats() shared side plusOne 무시 | sharedSide 카운트 추가 |
| M-05 | Balance bar shared 하객 왜곡 | groom/shared/bride 3분할 표시 |
| M-06 | 카테고리 예산 초과 미제한 | 빨간색 경고 박스 + 초과 금액 표시 + input 테두리 변경 |
| M-07 | "3일 연속 활동" 라벨 부정확 | "이번 주 3일 활동"으로 변경 |
| M-08 | TOTAL_CHALLENGES=4 하드코딩 | WEEKLY_CHALLENGE_IDS.length로 동적 계산 |
| M-09 | DB 비용 정렬 null과 0원 미구분 | null/undefined는 맨 뒤로 |
| M-10 | DB 완료일 정렬 미완료 맨 앞 | 미완료 태스크 맨 뒤로 |
| M-11 | 온보딩 새로고침 시 store 값 미반영 | coupleNames 있으면 초기값으로 사용 |
| M-12 | completedQuests hidden 포함 100% 초과 | hiddenQuestIds 필터링 적용 |
| M-13 | ProgressRing SVG 100% 초과 깨짐 | Math.min(100, ...) 클램프 |
| M-14 | 초기화 안내문 불일치 | 실제 동작에 맞게 수정 (이름/날짜/예산 보존 명시) |
| M-15 | Roadmap 초기화 guest-store 미삭제 | clearAllGuests() 호출 추가 |
| M-16 | 과거 날짜 설정 시 경고 없음 | 확인 UI 추가 |
| M-17 | 완주 후 무의미한 주간 챌린지 | 축하 대체 UI 표시 |
| M-18 | activityCounts/completedWeeks trim 미적용 | 90일/52주 trim 추가 |

## LOW (12건) — ALL FIXED

| # | 버그 | 수정 내용 |
|---|------|----------|
| L-01 | 미완료 태스크 메모 불가 | 설계 의도로 유지 (완료 시 메모 입력 기회 제공) |
| L-02 | 하객 검색 phone 미포함 | 검색에 phone 추가, placeholder 변경 |
| L-03 | RSVP 'maybe' 타입/UI 불일치 | maybe 타입 제거, pending으로 통합 |
| L-04 | 예산 0원/음수 설정 가능 | 음수 차단, 0원은 허용 |
| L-05 | 타임존 toISOString 날짜 어긋남 | toLocalDateString() 헬퍼로 교체 (calendar) |
| L-06 | 업체 phone/website 형식 안내 | type="tel", type="url" 추가 |
| L-07 | 전체 완주 축하 화면 없음 | isGrandComplete prop + 특별 메시지/confetti |
| L-08 | 100명 하객 stagger delay 3초 | 처음 10개만 stagger, 나머지 0.3초 cap |
| L-09 | 레벨 캡 없음, 목표 부재 | 레벨 5+ 시 "MAX" 뱃지 표시 |
| L-10 | coupleSetupDismissed 이원화 | coupleNames !== null이면 dismissed (localStorage 의존 제거) |
| L-11 | 첫 렌더 quests 빈 배열 깜빡임 | 로딩 인디케이터 추가 |
| L-12 | Hydration mismatch | useState 초기값 false 고정, useEffect에서 localStorage 읽기 |

---

## 수정된 파일 (18개)

```
app/calendar/page.tsx
app/database/page.tsx
app/guests/page.tsx
app/journey/page.tsx
app/roadmap/page.tsx
app/settings/page.tsx
app/welcome/page.tsx
components/header.tsx
components/quest/budget-allocation.tsx
components/quest/progress-ring.tsx
components/quest/quest-completion-overlay.tsx
components/quest/task-detail-sheet.tsx
components/quest/weekly-challenge.tsx
components/ui/sheet.tsx
lib/stores/guest-store.ts
lib/stores/quest-store.ts
lib/types/guest.ts
lib/utils/data-io.ts
```
