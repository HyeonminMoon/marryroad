'use client';

import { useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { useQuestStore } from '@/lib/stores/quest-store';
import { findDecisionImpact } from '@/lib/data/decision-impacts';
import { Sparkles, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { getTaskUrgency, parseRecommendedTiming } from '@/lib/utils/dday';

interface Recommendation {
  type: 'decision-based' | 'urgency' | 'next-step';
  emoji: string;
  title: string;
  description: string;
  questId?: string;
  questTitle?: string;
  questColor?: string;
  questIcon?: string;
  taskTitle?: string;
}

function generateRecommendations(
  quests: Quest[],
  progress: QuestProgress,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const selections = progress.decisionSelections;
  const weddingDate = progress.weddingDate;

  // 1. Decision-based recommendations
  for (const [, selectedOption] of Object.entries(selections)) {
    const impact = findDecisionImpact(selectedOption);
    if (!impact) continue;

    for (const affectedTitle of impact.affects) {
      // Find a task matching this affected title that isn't completed
      for (const quest of quests) {
        const qp = progress.taskProgress[quest.id];
        const completedIds = qp?.completedTaskIds || [];

        for (const task of quest.tasks) {
          if (
            task.title.includes(affectedTitle) &&
            !completedIds.includes(task.id)
          ) {
            // Check if we already have this rec
            if (recs.some(r => r.taskTitle === task.title)) continue;

            recs.push({
              type: 'decision-based',
              emoji: impact.emoji,
              title: `"${selectedOption.length > 15 ? selectedOption.slice(0, 15) + '…' : selectedOption}" 선택 기반`,
              description: `${task.title}을(를) 진행할 차례예요`,
              questId: quest.id,
              questTitle: quest.title,
              questColor: quest.color,
              questIcon: quest.icon,
              taskTitle: task.title,
            });
          }
        }
      }
    }
  }

  // 2. Urgency-based (overdue or due-soon tasks)
  if (weddingDate) {
    for (const quest of quests) {
      const qp = progress.taskProgress[quest.id];
      const completedIds = qp?.completedTaskIds || [];

      for (const task of quest.tasks) {
        if (completedIds.includes(task.id)) continue;
        const urgency = getTaskUrgency(task.recommendedTiming, weddingDate);
        if (urgency === 'overdue' && recs.length < 5) {
          recs.push({
            type: 'urgency',
            emoji: '🔴',
            title: '기한 초과',
            description: `${task.title} — 빨리 진행해주세요`,
            questId: quest.id,
            questTitle: quest.title,
            questColor: quest.color,
            questIcon: quest.icon,
            taskTitle: task.title,
          });
        }
      }
    }
  }

  // 3. Next step — find the first available uncompleted task
  if (recs.length === 0) {
    for (const quest of quests) {
      if (quest.status === 'available' || quest.status === 'in-progress') {
        const qp = progress.taskProgress[quest.id];
        const completedIds = qp?.completedTaskIds || [];
        const nextTask = quest.tasks.find(t => !completedIds.includes(t.id));
        if (nextTask) {
          recs.push({
            type: 'next-step',
            emoji: '👉',
            title: '다음 할 일',
            description: nextTask.title,
            questId: quest.id,
            questTitle: quest.title,
            questColor: quest.color,
            questIcon: quest.icon,
            taskTitle: nextTask.title,
          });
          break;
        }
      }
    }
  }

  // Limit to 3
  return recs.slice(0, 3);
}

interface SmartRecommendationProps {
  quests: Quest[];
  progress: QuestProgress;
  onQuestClick: (quest: Quest) => void;
}

export function SmartRecommendation({ quests, progress, onQuestClick }: SmartRecommendationProps) {
  const recommendations = useMemo(
    () => generateRecommendations(quests, progress),
    [quests, progress]
  );

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-950/30 dark:to-pink-950/20 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-800/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">맞춤 추천</span>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, idx) => {
          const quest = rec.questId ? quests.find(q => q.id === rec.questId) : null;
          const Icon = rec.questIcon ? getQuestIcon(rec.questIcon) : null;

          return (
            <motion.button
              key={`${rec.type}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => quest && onQuestClick(quest)}
              className="w-full text-left flex items-center gap-3 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-colors"
            >
              <span className="text-lg flex-shrink-0">{rec.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-purple-500 dark:text-purple-400 mb-0.5">
                  {rec.title}
                </p>
                <p className="text-xs text-gray-800 dark:text-gray-200 truncate">
                  {rec.description}
                </p>
                {rec.questTitle && (
                  <div className="flex items-center gap-1 mt-1">
                    {Icon && <Icon className="w-2.5 h-2.5" style={{ color: rec.questColor }} />}
                    <span className="text-[10px] text-gray-400 truncate">{rec.questTitle}</span>
                  </div>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
