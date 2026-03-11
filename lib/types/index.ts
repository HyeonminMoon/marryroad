export * from './quest';

/**
 * 커플 정보 타입
 * Supabase couples 테이블과 매핑됩니다.
 */
export interface Couple {
  id: string;
  partner1Id: string;
  partner2Id?: string;
  weddingDate?: string;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 알림 타입
 */
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

/**
 * 개별 스테이지 진행 정보
 */
export interface Progress {
  stage_id: string;
  completed: boolean;
  completedDate?: string;
  skipped: boolean;
  cost?: number;
  memo?: string;
}

/**
 * 전체 진행률 요약 정보
 */
export interface ProgressSummary {
  totalStages: number;
  completedStages: number;
  skippedStages: number;
  totalCost: number;
  completionPercent: number;
}
