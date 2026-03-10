'use client';

import { useMemo } from 'react';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getQuestIcon } from '@/lib/utils/icon-map';
import type { Quest, QuestProgress } from '@/lib/types/quest';

interface QuestStat {
  quest: Quest;
  total: number;
  completed: number;
  percent: number;
  cost: number;
  isQuestComplete: boolean;
}

interface QuestComparisonProps {
  quests: Quest[];
  progress: QuestProgress;
  onQuestClick?: (quest: Quest) => void;
}

export function QuestComparison({ quests, progress, onQuestClick }: QuestComparisonProps) {
  const stats = useMemo(() => {
    const result: QuestStat[] = quests.map(quest => {
      const tp = progress.taskProgress[quest.id];
      const completed = tp?.completedTaskIds?.length || 0;
      const total = quest.tasks.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      const cost = Object.values(tp?.taskCosts || {}).reduce((sum, c) => sum + (c || 0), 0);
      const isQuestComplete = progress.completedQuestIds.includes(quest.id);

      return { quest, total, completed, percent, cost, isQuestComplete };
    });

    // Sort: completed quests last, then by percent descending
    result.sort((a, b) => {
      if (a.isQuestComplete !== b.isQuestComplete) return a.isQuestComplete ? 1 : -1;
      return b.percent - a.percent;
    });

    return result;
  }, [quests, progress]);

  if (stats.length === 0) return null;

  const formatCost = (amount: number) => {
    if (amount === 0) return '-';
    if (amount >= 10000) return `${Math.round(amount / 10000).toLocaleString()}만`;
    return `${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">퀘스트 비교</span>
        <span className="ml-auto text-[10px] text-gray-400">{quests.length}개 퀘스트</span>
      </div>

      <div className="space-y-2.5">
        {stats.map((stat, idx) => {
          const Icon = getQuestIcon(stat.quest.icon);
          return (
            <motion.div
              key={stat.quest.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className={`flex items-center gap-2.5 ${stat.isQuestComplete ? 'opacity-60' : ''} ${onQuestClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-1 rounded-lg transition-colors' : ''}`}
              onClick={() => onQuestClick?.(stat.quest)}
            >
              {/* Quest icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.quest.color + '20' }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: stat.quest.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    {stat.quest.title}
                  </span>
                  {stat.isQuestComplete && (
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                  )}
                </div>
                {/* Mini progress bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percent}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.04 + 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.quest.color }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 flex-shrink-0 text-right">
                <span className="text-[11px] font-bold tabular-nums" style={{ color: stat.quest.color }}>
                  {stat.percent}%
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums w-10">
                  {stat.completed}/{stat.total}
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums w-10">
                  {formatCost(stat.cost)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
