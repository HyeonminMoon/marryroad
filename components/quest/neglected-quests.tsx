'use client';

import { useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

const NEGLECT_THRESHOLD_DAYS = 7;

interface NeglectedQuest {
  quest: Quest;
  daysSinceActivity: number;
  remainingTasks: number;
}

interface NeglectedQuestsProps {
  quests: Quest[];
  progress: QuestProgress;
  onQuestClick: (quest: Quest) => void;
}

export function NeglectedQuests({ quests, progress, onQuestClick }: NeglectedQuestsProps) {
  const neglected = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const results: NeglectedQuest[] = [];

    for (const quest of quests) {
      // Skip completed or locked quests
      if (progress.completedQuestIds.includes(quest.id)) continue;

      const tp = progress.taskProgress[quest.id];
      if (!tp || tp.completedTaskIds.length === 0) continue;

      // Find last activity date
      let lastDate: string | null = null;
      for (const taskId of tp.completedTaskIds) {
        const date = tp.taskExtendedData?.[taskId]?.completedDate;
        if (date && (!lastDate || date > lastDate)) {
          lastDate = date;
        }
      }

      if (!lastDate) continue;

      const lastActivity = new Date(lastDate);
      lastActivity.setHours(0, 0, 0, 0);
      const daysSince = Math.floor((today.getTime() - lastActivity.getTime()) / 86400000);

      if (daysSince >= NEGLECT_THRESHOLD_DAYS) {
        const remaining = quest.tasks.length - tp.completedTaskIds.length;
        if (remaining > 0) {
          results.push({ quest, daysSinceActivity: daysSince, remainingTasks: remaining });
        }
      }
    }

    return results.sort((a, b) => b.daysSinceActivity - a.daysSinceActivity).slice(0, 2);
  }, [quests, progress]);

  if (neglected.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-950/30 dark:to-orange-950/20 backdrop-blur-lg rounded-2xl border border-amber-200/30 dark:border-amber-800/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">잊고 있진 않으세요?</span>
      </div>

      <div className="space-y-2">
        {neglected.map(({ quest, daysSinceActivity, remainingTasks }, idx) => {
          const Icon = getQuestIcon(quest.icon);
          return (
            <motion.button
              key={quest.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => onQuestClick(quest)}
              className="w-full text-left flex items-center gap-3 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: quest.color + '20' }}
              >
                <Icon className="w-4 h-4" style={{ color: quest.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {quest.title}
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  {daysSinceActivity}일 전 마지막 활동 · {remainingTasks}개 남음
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
