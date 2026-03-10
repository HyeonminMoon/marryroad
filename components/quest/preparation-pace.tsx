'use client';

import { useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PaceStatus {
  label: string;
  emoji: string;
  message: string;
  color: string;
  icon: typeof TrendingUp;
}

const PACE_STATUSES: Record<string, PaceStatus> = {
  ahead: {
    label: '빠른 진행',
    emoji: '🏃',
    message: '예정보다 앞서가고 있어요!',
    color: 'text-green-600 dark:text-green-400',
    icon: TrendingUp,
  },
  'on-track': {
    label: '적절한 속도',
    emoji: '👍',
    message: '딱 맞는 속도예요, 잘하고 있어요!',
    color: 'text-blue-600 dark:text-blue-400',
    icon: Minus,
  },
  behind: {
    label: '조금 서두르세요',
    emoji: '⏰',
    message: '속도를 조금 높여볼까요?',
    color: 'text-amber-600 dark:text-amber-400',
    icon: TrendingDown,
  },
};

interface PreparationPaceProps {
  quests: Quest[];
  progress: QuestProgress;
}

export function PreparationPace({ quests, progress }: PreparationPaceProps) {
  const paceData = useMemo(() => {
    if (!progress.weddingDate) return null;

    const activeDates = progress.activeDates || [];
    if (activeDates.length === 0) return null;

    const firstDate = [...activeDates].sort()[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(firstDate);
    start.setHours(0, 0, 0, 0);
    const wedding = new Date(progress.weddingDate);
    wedding.setHours(0, 0, 0, 0);

    const totalDuration = wedding.getTime() - start.getTime();
    if (totalDuration <= 0) return null;

    const elapsed = today.getTime() - start.getTime();
    const timePercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    const totalTasks = quests.reduce((sum, q) => sum + q.tasks.length, 0);
    const completedTasks = Object.values(progress.taskProgress).reduce(
      (sum, tp) => sum + tp.completedTaskIds.length, 0
    );
    const prepPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const pace = prepPercent - timePercent;
    const status = pace > 10 ? 'ahead' : pace >= -10 ? 'on-track' : 'behind';

    return { timePercent, prepPercent, status, pace };
  }, [quests, progress]);

  if (!paceData) return null;

  const status = PACE_STATUSES[paceData.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{status.emoji}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">준비 페이스</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>
      </div>

      {/* Dual progress bars */}
      <div className="space-y-2.5">
        {/* Time bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">시간 경과</span>
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{paceData.timePercent}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paceData.timePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"
            />
          </div>
        </div>

        {/* Preparation bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">준비 완료</span>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{paceData.prepPercent}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paceData.prepPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <p className={`text-xs mt-3 ${status.color}`}>
        {status.message}
      </p>
    </div>
  );
}
