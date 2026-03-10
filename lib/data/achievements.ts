/**
 * Achievement Definition & Checker
 *
 * Achievements are computed from existing progress data.
 * No separate persistence needed for unlock state.
 */

import { Quest, QuestProgress } from '@/lib/types/quest';
import { DEFAULT_BUDGET } from '@/lib/constants';
import { calculateStreak } from '@/lib/utils/streak';

export type AchievementTier = 'bronze' | 'silver' | 'gold';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  tier: AchievementTier;
  xp: number;
  icon: string; // emoji
  check: (progress: QuestProgress, quests: Quest[]) => boolean;
}

/** Count total completed tasks across all quests */
function totalCompletedTasks(progress: QuestProgress): number {
  return Object.values(progress.taskProgress).reduce(
    (sum, tp) => sum + tp.completedTaskIds.length,
    0
  );
}

/** Count total memos written */
function totalMemos(progress: QuestProgress): number {
  let count = 0;
  for (const tp of Object.values(progress.taskProgress)) {
    for (const ext of Object.values(tp.taskExtendedData || {})) {
      if (ext.memo && ext.memo.trim().length > 0) count++;
    }
  }
  return count;
}

/** Count total costs recorded */
function totalCostsRecorded(progress: QuestProgress): number {
  let count = 0;
  for (const tp of Object.values(progress.taskProgress)) {
    for (const cost of Object.values(tp.taskCosts || {})) {
      if (cost > 0) count++;
    }
  }
  return count;
}

/** Total tasks across all quests */
function totalTaskCount(quests: Quest[]): number {
  return quests.reduce((sum, q) => sum + q.tasks.length, 0);
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Bronze (easy) — Challenges
  {
    id: 'challenge-starter',
    name: '챌린지 도전자',
    description: '첫 주간 챌린지를 완료하세요',
    tier: 'bronze',
    xp: 25,
    icon: '🏅',
    check: (p) => (p.weeklyChallenge?.claimedRewards?.length || 0) >= 1,
  },
  // Bronze (easy)
  {
    id: 'first-step',
    name: '첫 걸음',
    description: '첫 번째 태스크를 완료하세요',
    tier: 'bronze',
    xp: 25,
    icon: '👣',
    check: (p) => totalCompletedTasks(p) >= 1,
  },
  {
    id: 'memo-writer',
    name: '기록의 시작',
    description: '첫 번째 메모를 작성하세요',
    tier: 'bronze',
    xp: 25,
    icon: '📝',
    check: (p) => totalMemos(p) >= 1,
  },
  {
    id: 'budget-setter',
    name: '예산 마스터',
    description: '예산을 설정하세요',
    tier: 'bronze',
    xp: 25,
    icon: '💰',
    check: (p) => p.budget.total !== DEFAULT_BUDGET,
  },
  {
    id: 'cost-tracker',
    name: '꼼꼼한 기록',
    description: '비용을 5건 이상 기록하세요',
    tier: 'bronze',
    xp: 25,
    icon: '🧾',
    check: (p) => totalCostsRecorded(p) >= 5,
  },

  // Silver (medium) — Challenges
  {
    id: 'challenge-week-clear',
    name: '주간 올클리어',
    description: '한 주에 챌린지 4개를 모두 완료하세요',
    tier: 'silver',
    xp: 50,
    icon: '🏆',
    check: (p) => (p.weeklyChallenge?.completedWeeks?.length || 0) >= 1,
  },
  {
    id: 'challenge-streak-2',
    name: '2주 연속 클리어',
    description: '2주 연속으로 챌린지를 올클리어하세요',
    tier: 'silver',
    xp: 50,
    icon: '⚡',
    check: (p) => {
      const weeks = p.weeklyChallenge?.completedWeeks || [];
      if (weeks.length < 2) return false;
      // Check for consecutive weeks
      const sorted = [...weeks].sort();
      for (let i = 0; i < sorted.length - 1; i++) {
        const d1 = new Date(sorted[i] + 'T00:00:00');
        const d2 = new Date(sorted[i + 1] + 'T00:00:00');
        const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 7) return true;
      }
      return false;
    },
  },
  // Silver (medium)
  {
    id: 'ten-tasks',
    name: '열 번째 완료',
    description: '태스크 10개를 완료하세요',
    tier: 'silver',
    xp: 50,
    icon: '🔟',
    check: (p) => totalCompletedTasks(p) >= 10,
  },
  {
    id: 'first-quest',
    name: '퀘스트 클리어',
    description: '첫 번째 퀘스트를 완료하세요',
    tier: 'silver',
    xp: 50,
    icon: '⚔️',
    check: (p) => p.completedQuestIds.length >= 1,
  },
  {
    id: 'memo-collector',
    name: '이야기 수집가',
    description: '메모를 10개 이상 작성하세요',
    tier: 'silver',
    xp: 50,
    icon: '📚',
    check: (p) => totalMemos(p) >= 10,
  },
  {
    id: 'thirty-tasks',
    name: '30개 돌파',
    description: '태스크 30개를 완료하세요',
    tier: 'silver',
    xp: 50,
    icon: '🚀',
    check: (p) => totalCompletedTasks(p) >= 30,
  },
  {
    id: 'week-streak',
    name: '일주일 연속',
    description: '7일 연속으로 태스크를 완료하세요',
    tier: 'silver',
    xp: 50,
    icon: '🔥',
    check: (p) => calculateStreak(p.activeDates || []) >= 7,
  },

  // Gold (hard) — Challenges
  {
    id: 'challenge-streak-4',
    name: '4주 연속 클리어',
    description: '4주 연속으로 챌린지를 올클리어하세요',
    tier: 'gold',
    xp: 100,
    icon: '👑',
    check: (p) => {
      const weeks = p.weeklyChallenge?.completedWeeks || [];
      if (weeks.length < 4) return false;
      const sorted = [...weeks].sort();
      let consecutive = 1;
      for (let i = 0; i < sorted.length - 1; i++) {
        const d1 = new Date(sorted[i] + 'T00:00:00');
        const d2 = new Date(sorted[i + 1] + 'T00:00:00');
        const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 7) {
          consecutive++;
          if (consecutive >= 4) return true;
        } else {
          consecutive = 1;
        }
      }
      return false;
    },
  },
  // Gold (hard)
  {
    id: 'two-week-streak',
    name: '2주 연속',
    description: '14일 연속으로 태스크를 완료하세요',
    tier: 'gold',
    xp: 75,
    icon: '🔥',
    check: (p) => calculateStreak(p.activeDates || []) >= 14,
  },
  {
    id: 'month-streak',
    name: '한 달 연속',
    description: '30일 연속으로 태스크를 완료하세요',
    tier: 'gold',
    xp: 100,
    icon: '💥',
    check: (p) => calculateStreak(p.activeDates || []) >= 30,
  },
  {
    id: 'half-way',
    name: '절반의 성공',
    description: '전체 태스크의 50%를 완료하세요',
    tier: 'gold',
    xp: 75,
    icon: '🌟',
    check: (p, q) => totalCompletedTasks(p) >= totalTaskCount(q) / 2,
  },
  {
    id: 'five-quests',
    name: '다섯 고개',
    description: '퀘스트 5개를 완료하세요',
    tier: 'gold',
    xp: 75,
    icon: '🏔️',
    check: (p) => p.completedQuestIds.length >= 5,
  },
  {
    id: 'level-five',
    name: '레벨 5',
    description: '레벨 5에 도달하세요',
    tier: 'gold',
    xp: 75,
    icon: '👑',
    check: (p) => p.level >= 5,
  },
  {
    id: 'grand-master',
    name: '그랜드 마스터',
    description: '모든 태스크를 완료하세요',
    tier: 'gold',
    xp: 100,
    icon: '💎',
    check: (p, q) => totalCompletedTasks(p) >= totalTaskCount(q) && totalTaskCount(q) > 0,
  },
];

/**
 * Check which achievements are currently unlocked.
 * Returns array of unlocked achievement IDs.
 */
export function getUnlockedAchievements(
  progress: QuestProgress,
  quests: Quest[]
): string[] {
  return ACHIEVEMENTS
    .filter(a => a.check(progress, quests))
    .map(a => a.id);
}

/**
 * Get newly unlocked achievements by comparing with previously seen set.
 */
export function getNewAchievements(
  currentUnlocked: string[],
  previouslySeen: string[]
): AchievementDef[] {
  const newIds = currentUnlocked.filter(id => !previouslySeen.includes(id));
  return ACHIEVEMENTS.filter(a => newIds.includes(a.id));
}

export const TIER_COLORS: Record<AchievementTier, { bg: string; border: string; text: string }> = {
  bronze: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-300',
  },
  silver: {
    bg: 'bg-slate-50 dark:bg-slate-900/30',
    border: 'border-slate-300 dark:border-slate-600',
    text: 'text-slate-700 dark:text-slate-300',
  },
  gold: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-400 dark:border-yellow-600',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
};
