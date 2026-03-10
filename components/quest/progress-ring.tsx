'use client';

import { useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useCountUp } from '@/lib/hooks/use-count-up';
import { calculateStreak } from '@/lib/utils/streak';
import { getDdayCount } from '@/lib/utils/dday';
import type { QuestProgress } from '@/lib/types/quest';

interface ProgressRingProps {
  progress: QuestProgress;
  totalQuests: number;
  completedQuests: number;
  currentLevelXp: number;
  nextLevelXp: number;
}

const RING_SIZE = 72;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({
  progress,
  totalQuests,
  completedQuests,
  currentLevelXp,
  nextLevelXp,
}: ProgressRingProps) {
  const gradientId = useId();
  const overallPercent = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  const animatedPercent = useCountUp(overallPercent, 800);
  const animatedXp = useCountUp(currentLevelXp, 800);

  const dashOffset = CIRCUMFERENCE - (overallPercent / 100) * CIRCUMFERENCE;

  const { current: streak } = calculateStreak(progress.activeDates || []);
  const dday = progress.weddingDate ? getDdayCount(progress.weddingDate) : null;

  const formatBudget = (amount: number) => {
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}만`;
    return amount.toLocaleString();
  };

  const ddayLabel = useMemo(() => {
    if (dday === null) return null;
    if (dday > 0) return `D-${dday}`;
    if (dday === 0) return 'D-Day';
    return `D+${Math.abs(dday)}`;
  }, [dday]);

  const ddayColor = useMemo(() => {
    if (dday === null) return '';
    if (dday <= 30) return 'text-red-600 dark:text-red-400';
    if (dday <= 90) return 'text-amber-600 dark:text-amber-400';
    return 'text-purple-600 dark:text-purple-400';
  }, [dday]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-5"
    >
      {/* SVG Ring */}
      <div className="relative flex-shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress arc */}
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-gray-900 dark:text-gray-100 leading-none">
            {animatedPercent}%
          </span>
        </div>
      </div>

      {/* Right side: Level + XP + Stats */}
      <div className="flex-1 min-w-0">
        {/* Level + Quest count */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            레벨 {progress.level}
          </span>
          <span className="text-xs text-gray-400">
            {completedQuests}/{totalQuests} 퀘스트
          </span>
        </div>

        {/* XP bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {animatedXp} / {nextLevelXp} XP
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((currentLevelXp / nextLevelXp) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Compact stats row */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
          {ddayLabel && (
            <span className={`font-bold ${ddayColor}`}>{ddayLabel}</span>
          )}
          {streak > 0 && (
            <>
              {ddayLabel && <span className="text-gray-300 dark:text-gray-600">·</span>}
              <span className="font-bold text-orange-600 dark:text-orange-400">🔥 {streak}</span>
            </>
          )}
          {(ddayLabel || streak > 0) && <span className="text-gray-300 dark:text-gray-600">·</span>}
          <span>
            {formatBudget(progress.budget.spent)}원 / {formatBudget(progress.budget.total)}원
          </span>
        </div>
      </div>
    </motion.div>
  );
}
