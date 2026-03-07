'use client';

import React, { useState, useCallback } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { Flame, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TodaySectionProps {
  quests: Quest[];
  progress: QuestProgress;
  onTaskQuickComplete: (questId: string, taskId: string) => void;
  onQuestClick: (quest: Quest) => void;
}

/** 추천 태스크: available/in-progress 퀘스트에서 아직 안 한 태스크 중 가장 앞에 있는 것 */
function getRecommendedTasks(
  quests: Quest[],
  progress: QuestProgress,
  max: number = 3
) {
  const results: { quest: Quest; taskId: string; taskTitle: string }[] = [];

  for (const quest of quests) {
    if (quest.status !== 'available' && quest.status !== 'in-progress') continue;

    const completedIds =
      progress.taskProgress[quest.id]?.completedTaskIds || [];

    for (const task of quest.tasks) {
      if (!completedIds.includes(task.id)) {
        results.push({
          quest,
          taskId: task.id,
          taskTitle: task.title,
        });
        break; // 퀘스트 당 첫 번째 미완료 태스크만
      }
    }

    if (results.length >= max) break;
  }

  return results;
}

/** 전체 완료 태스크 수 / 전체 태스크 수 */
function getOverallProgress(quests: Quest[], progress: QuestProgress) {
  let total = 0;
  let completed = 0;

  for (const quest of quests) {
    total += quest.tasks.length;
    const completedIds =
      progress.taskProgress[quest.id]?.completedTaskIds || [];
    completed += completedIds.length;
  }

  return { total, completed };
}

export function TodaySection({
  quests,
  progress,
  onTaskQuickComplete,
  onQuestClick,
}: TodaySectionProps) {
  // 퀵 컴플리트 후 잠깐 동안 완료 애니메이션을 보여주기 위한 상태
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  const handleQuickComplete = useCallback(
    (e: React.MouseEvent, questId: string, taskId: string) => {
      e.stopPropagation(); // 카드 클릭(onQuestClick) 방지

      onTaskQuickComplete(questId, taskId);

      // confetti
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });

      // 완료 애니메이션 표시
      setJustCompleted((prev) => new Set(prev).add(taskId));
      setTimeout(() => {
        setJustCompleted((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, 1500);
    },
    [onTaskQuickComplete]
  );

  const recommended = getRecommendedTasks(quests, progress, 3);
  const { total, completed } = getOverallProgress(quests, progress);
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 스트릭 (더미 값 - 추후 lastActiveDate 기반으로 계산)
  const streakDays = 3;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          다음 할 일
        </h2>
        <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-bold">{streakDays}일 연속</span>
        </div>
      </div>

      {/* 추천 태스크 카드 */}
      <div className="space-y-3 mb-5">
        <AnimatePresence mode="popLayout">
          {recommended.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
            >
              모든 태스크를 완료했어요!
            </motion.p>
          ) : (
            recommended.map(({ quest, taskId, taskTitle }) => {
              const Icon = getQuestIcon(quest.icon);
              const isJustDone = justCompleted.has(taskId);

              return (
                <motion.div
                  key={taskId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onQuestClick(quest)}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                >
                  {/* 퀘스트 아이콘 */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: quest.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: quest.color }} />
                  </div>

                  {/* 태스크 제목 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {taskTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {quest.title}
                    </p>
                  </div>

                  {/* 퀵 컴플리트 버튼 */}
                  <motion.button
                    onClick={(e) => handleQuickComplete(e, quest.id, taskId)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isJustDone
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-green-400 hover:text-green-500'
                    }`}
                    whileTap={{ scale: 0.85 }}
                    animate={
                      isJustDone
                        ? { scale: [1, 1.2, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* 진행 요약 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            전체 {total}개 중 {completed}개 완료
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
