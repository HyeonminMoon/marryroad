'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Award } from 'lucide-react';
import { ACHIEVEMENTS, TIER_COLORS, type AchievementDef } from '@/lib/data/achievements';

interface AchievementGridProps {
  unlockedIds: string[];
}

function AchievementBadge({
  achievement,
  unlocked,
}: {
  achievement: AchievementDef;
  unlocked: boolean;
}) {
  const tier = TIER_COLORS[achievement.tier];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
        unlocked
          ? `${tier.bg} ${tier.border}`
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50'
      }`}
    >
      <span className="text-2xl" role="img" aria-label={achievement.name}>
        {unlocked ? achievement.icon : '?'}
      </span>
      <span
        className={`text-xs font-bold text-center leading-tight ${
          unlocked ? tier.text : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {unlocked ? achievement.name : '???'}
      </span>
      {unlocked && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          +{achievement.xp} XP
        </span>
      )}
      {!unlocked && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
          {achievement.description}
        </span>
      )}
    </motion.div>
  );
}

export function AchievementGrid({ unlockedIds }: AchievementGridProps) {
  const [expanded, setExpanded] = useState(false);
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            업적
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Grid - expandable */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ACHIEVEMENTS.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedIds.includes(achievement.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
