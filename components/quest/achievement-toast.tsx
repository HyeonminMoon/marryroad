'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIER_COLORS, type AchievementDef } from '@/lib/data/achievements';

interface AchievementToastProps {
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border-2 ${
              TIER_COLORS[achievement.tier].bg
            } ${TIER_COLORS[achievement.tier].border}`}
          >
            <motion.span
              className="text-3xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
            >
              {achievement.icon}
            </motion.span>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                업적 달성!
              </p>
              <p
                className={`font-bold ${TIER_COLORS[achievement.tier].text}`}
              >
                {achievement.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                {achievement.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +{achievement.xp} XP
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
