'use client';

import { useMemo } from 'react';
import { calculateStreak } from '@/lib/utils/streak';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface DailyStreakProps {
  activeDates: string[];
}

export function DailyStreak({ activeDates }: DailyStreakProps) {
  const { current, best, isActiveToday } = useMemo(
    () => calculateStreak(activeDates),
    [activeDates]
  );

  if (current === 0 && best === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-950/30 dark:to-amber-950/20 backdrop-blur-lg rounded-2xl border border-orange-200/30 dark:border-orange-800/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Fire emoji with pulse */}
          <motion.span
            className="text-3xl"
            animate={current > 0 ? {
              scale: [1, 1.15, 1],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {current > 0 ? '🔥' : '💤'}
          </motion.span>

          <div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={current}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-black text-gray-900 dark:text-gray-100"
              >
                {current}
              </motion.span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                일 연속
              </span>
            </div>

            {!isActiveToday && current > 0 && (
              <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mt-0.5">
                오늘 아직! 스트릭을 유지하세요
              </p>
            )}
            {isActiveToday && current > 0 && (
              <p className="text-xs text-green-500 dark:text-green-400 font-medium mt-0.5">
                오늘도 달성 완료!
              </p>
            )}
            {current === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                오늘 활동하면 스트릭 시작!
              </p>
            )}
          </div>
        </div>

        {/* Best streak badge */}
        {best > 1 && (
          <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 dark:border-gray-700/30">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              최고 {best}일
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
