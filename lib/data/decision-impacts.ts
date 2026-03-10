/**
 * Decision Impact Map
 * Maps option selections to their downstream implications.
 * Key format: partial match on option text (Korean)
 */

export interface DecisionImpact {
  emoji: string;
  summary: string;
  affects: string[]; // downstream task titles affected
}

/**
 * Maps option keyword → impact insight
 * Matched by checking if the selected option text includes the keyword
 */
export const DECISION_IMPACT_MAP: Record<string, DecisionImpact> = {
  // Season selection
  '봄 (3~5월)': {
    emoji: '🌸',
    summary: '성수기라 웨딩홀·스드메 1년 전 예약 필수. 비용이 높지만 날씨가 좋아 야외 촬영에 유리해요.',
    affects: ['웨딩홀 선정', '스드메 업체 선정', '항목별 예산 배분'],
  },
  '여름 (6~8월)': {
    emoji: '☀️',
    summary: '비수기 할인 혜택이 크지만, 더위 때문에 실내 위주로 계획해야 해요. 하객 참석률이 낮을 수 있어요.',
    affects: ['웨딩홀 선정', '항목별 예산 배분', '허니문 시기'],
  },
  '가을 (9~11월)': {
    emoji: '🍂',
    summary: '가장 인기 시즌! 최소 1년 전 예약이 필수이고, 프리미엄 비용을 감안해야 해요.',
    affects: ['웨딩홀 선정', '스드메 업체 선정', '택일 vs 웨딩홀 조율'],
  },
  '겨울 (12~2월)': {
    emoji: '❄️',
    summary: '비수기 할인이 크고 예약이 수월해요. 교통·추위 대비와 하객 동선을 고려하세요.',
    affects: ['웨딩홀 선정', '항목별 예산 배분', '허니문 시기'],
  },

  // Day of week
  '토요일': {
    emoji: '📅',
    summary: '가장 인기 요일이라 비용이 높고 경쟁이 치열해요. 일찍 예약하세요.',
    affects: ['웨딩홀 선정', '택일 vs 웨딩홀 조율'],
  },
  '일요일': {
    emoji: '📅',
    summary: '토요일 대비 비용이 낮지만, 하객이 다음 날 출근이라 참석률이 살짝 낮을 수 있어요.',
    affects: ['웨딩홀 선정'],
  },
  '평일': {
    emoji: '📅',
    summary: '비용이 가장 저렴하지만 하객 참석이 어려울 수 있어요. 소규모 웨딩에 적합해요.',
    affects: ['웨딩홀 선정', '하객 규모'],
  },

  // Time slot
  '골든타임': {
    emoji: '⏰',
    summary: '가장 인기 시간대(12~2시)라 견적이 높아요. 점심 식사 포함이 자연스러워요.',
    affects: ['웨딩홀 선정', '항목별 예산 배분'],
  },
  '첫 타임': {
    emoji: '🌅',
    summary: '오전 타임은 원판 사진 사전 촬영이 가능하고 할인 혜택이 있어요.',
    affects: ['웨딩홀 선정', '스드메 스케줄'],
  },
  '늦은 오후': {
    emoji: '🌇',
    summary: '할인 혜택이 크고 저녁 분위기 연출이 가능해요. 야외 라이트닝이 예뻐요.',
    affects: ['웨딩홀 선정'],
  },

  // Budget range
  '3천만 원 이하': {
    emoji: '💰',
    summary: '비수기·가성비 전략이 필수예요. 업체 비교를 꼼꼼히 하면 충분히 가능해요.',
    affects: ['웨딩홀 선정', '스드메 업체 선정', '예물 구입', '허니문'],
  },
  '3천~5천만 원': {
    emoji: '💰',
    summary: '평균 범위예요. 밸런스 있게 배분하면 원하는 퀄리티를 맞출 수 있어요.',
    affects: ['항목별 예산 배분'],
  },
  '5천~7천만 원': {
    emoji: '💰',
    summary: '여유 범위예요. 원하는 업체를 선택할 폭이 넓어져요.',
    affects: ['항목별 예산 배분'],
  },
  '7천만 원 이상': {
    emoji: '💎',
    summary: '프리미엄 웨딩이 가능해요. 톱급 업체와 맞춤 서비스를 고려해보세요.',
    affects: ['항목별 예산 배분', '웨딩홀 선정', '스드메 업체 선정'],
  },

  // 택일 방식
  '부모님 사주 택일': {
    emoji: '🏮',
    summary: '전통 방식이에요. 날짜 범위를 먼저 받고 웨딩홀 빈자리와 교차 확인이 필요해요.',
    affects: ['택일 vs 웨딩홀 조율', '시기 결정'],
  },
  '커플 직접 선택': {
    emoji: '💑',
    summary: '기념일이나 원하는 날짜로 자유롭게 지정할 수 있어요. 웨딩홀 빈자리만 확인하면 돼요.',
    affects: ['택일 vs 웨딩홀 조율'],
  },
  '웨딩홀 빈자리 맞춤': {
    emoji: '🏛️',
    summary: '원하는 홀이 정해져 있을 때 유리해요. 날짜 유연성이 필요해요.',
    affects: ['택일 vs 웨딩홀 조율', '웨딩홀 선정'],
  },

  // Cost sharing
  '양가 반반': {
    emoji: '⚖️',
    summary: '가장 깔끔한 방식이에요. 총액 기준으로 나누면 관리가 쉬워요.',
    affects: ['항목별 예산 배분'],
  },
  '항목별 분담': {
    emoji: '📋',
    summary: '각 항목을 누가 부담할지 미리 정해요. 상견례 전에 반드시 사전 조율하세요.',
    affects: ['항목별 예산 배분', '상견례'],
  },
  '각자 부담': {
    emoji: '👤',
    summary: '신랑·신부 각자 자기 것을 부담해요. 독립적이지만 총액 관리가 어려울 수 있어요.',
    affects: ['항목별 예산 배분'],
  },
};

/**
 * Find impact for a selected option text
 * Uses partial matching (option text includes keyword)
 */
export function findDecisionImpact(optionText: string): DecisionImpact | null {
  for (const [keyword, impact] of Object.entries(DECISION_IMPACT_MAP)) {
    if (optionText.includes(keyword) || keyword.includes(optionText)) {
      return impact;
    }
  }
  return null;
}
