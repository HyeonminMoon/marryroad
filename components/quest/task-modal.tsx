'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Quest, Task, TaskExtendedData } from '@/lib/types/quest';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  Star,
  Check,
} from 'lucide-react';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useQuestStore } from '@/lib/stores/quest-store';
import { TaskDetailSheet } from './task-detail-sheet';

interface TaskModalProps {
  quest: Quest | null;
  open: boolean;
  onClose: () => void;
}

/** 태스크를 ID의 첫 번째 숫자(X.Y.Z에서 X)로 그룹핑 */
function groupTasksByPrefix(tasks: Task[]) {
  const groups: { prefix: string; label: string; tasks: Task[] }[] = [];
  const groupMap = new Map<string, Task[]>();

  for (const task of tasks) {
    const prefix = task.id.split('.')[0];
    if (!groupMap.has(prefix)) {
      groupMap.set(prefix, []);
    }
    groupMap.get(prefix)!.push(task);
  }

  // 고유 prefix가 1개뿐이면 그룹핑 불필요
  if (groupMap.size <= 1) return null;

  for (const [prefix, groupTasks] of groupMap) {
    const label = groupTasks[0].title;
    groups.push({ prefix, label, tasks: groupTasks });
  }

  return groups;
}

export function TaskModal({ quest, open, onClose }: TaskModalProps) {
  const { completeTask, progress } = useQuestStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  if (!quest) return null;

  const questProgress = progress.taskProgress[quest.id];
  const completedTaskIds = questProgress?.completedTaskIds || [];

  // 태스크 그룹핑 (5개 이상 태스크가 있는 퀘스트에서만)
  const taskGroups = quest.tasks.length >= 5 ? groupTasksByPrefix(quest.tasks) : null;

  const toggleGroup = (prefix: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) {
        next.delete(prefix);
      } else {
        next.add(prefix);
      }
      return next;
    });
  };

  /** 퀵 컴플리트: 체크 한 번으로 태스크 완료 */
  const handleQuickComplete = (taskId: string) => {
    completeTask(quest.id, taskId, undefined, {
      completedDate: new Date().toISOString().split('T')[0],
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
    });

    setJustCompleted((prev) => new Set(prev).add(taskId));
    setTimeout(() => {
      setJustCompleted((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }, 1200);
  };

  const handleTaskComplete = (taskId: string, data: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
  }) => {
    const extendedData = {
      memo: data.memo,
      completedDate: data.date || new Date().toISOString().split('T')[0],
      vendorInfo: data.vendorInfo,
      rating: data.rating,
    };

    completeTask(quest.id, taskId, data.cost, extendedData);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const Icon = getQuestIcon(quest.icon);

  // Get existing data for selected task
  const selectedTaskCompleted = selectedTask ? completedTaskIds.includes(selectedTask.id) : false;
  const selectedTaskCost = selectedTask ? questProgress?.taskCosts[selectedTask.id] : undefined;
  const selectedTaskExtData = selectedTask ? questProgress?.taskExtendedData?.[selectedTask.id] : undefined;

  /** 개별 태스크 렌더링 */
  const renderTaskItem = (task: Task, index: number) => {
    const isCompleted = completedTaskIds.includes(task.id);
    const userCost = questProgress?.taskCosts[task.id];
    const extData = questProgress?.taskExtendedData?.[task.id];
    const isJustDone = justCompleted.has(task.id);

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.05 }}
        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          isCompleted
            ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/50'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
        onClick={() => setSelectedTask(task)}
      >
        <div className="flex items-start gap-3">
          {/* 퀵 컴플리트 원형 체크 버튼 */}
          {!isCompleted ? (
            <motion.button
              onClick={(e) => { e.stopPropagation(); handleQuickComplete(task.id); }}
              className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isJustDone
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
              }`}
              whileTap={{ scale: 0.8 }}
              animate={isJustDone ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              title="퀵 완료"
            >
              {isJustDone && <Check className="w-3.5 h-3.5" />}
            </motion.button>
          ) : (
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-semibold text-sm ${
                    isCompleted ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </h4>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    {task.recommendedTiming}
                  </span>
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
                    {task.estimatedDuration}
                  </span>
                  {task.isOptional && (
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      선택
                    </span>
                  )}
                </div>
              </div>

              {/* Compact summary for completed tasks */}
              {isCompleted && (userCost || extData?.memo || extData?.vendorInfo) && (
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {userCost && (
                    <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {userCost.toLocaleString()}원
                    </span>
                  )}
                  {extData?.memo && <FileText className="w-3 h-3 text-gray-400" />}
                  {extData?.vendorInfo && <Building2 className="w-3 h-3 text-gray-400" />}
                  {extData?.rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-gray-500">{extData.rating}</span>
                    </div>
                  )}
                </div>
              )}

              <ChevronRight className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0 mt-1" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl" style={{ backgroundColor: quest.color + '20' }}>
                <Icon className="w-8 h-8" style={{ color: quest.color }} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{quest.title}</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  {quest.tasks.length}개 작업 • {quest.progress}% 완료 • +{quest.xp} XP
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">전체 진행률</span>
              <span className="text-lg font-bold" style={{ color: quest.color }}>
                {completedTaskIds.length} / {quest.tasks.length}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: quest.color }}
                initial={{ width: 0 }}
                animate={{ width: `${quest.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {taskGroups
                ? taskGroups.map((group) => {
                    const isGroupCollapsed = collapsedGroups.has(group.prefix);
                    const groupCompleted = group.tasks.filter((t) =>
                      completedTaskIds.includes(t.id)
                    ).length;

                    return (
                      <div key={group.prefix} className="space-y-2">
                        {/* 그룹 헤더 */}
                        <button
                          onClick={() => toggleGroup(group.prefix)}
                          className="w-full flex items-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              isGroupCollapsed ? '-rotate-90' : ''
                            }`}
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1 text-left">
                            {group.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {groupCompleted}/{group.tasks.length}
                          </span>
                        </button>

                        {/* 그룹 태스크 목록 */}
                        {!isGroupCollapsed &&
                          group.tasks.map((task, index) =>
                            renderTaskItem(task, index)
                          )}
                      </div>
                    );
                  })
                : quest.tasks.map((task, index) => renderTaskItem(task, index))}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Detail Bottom Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        quest={quest}
        isCompleted={selectedTaskCompleted}
        existingData={{
          cost: selectedTaskCost,
          memo: selectedTaskExtData?.memo,
          date: selectedTaskExtData?.completedDate,
          vendorInfo: selectedTaskExtData?.vendorInfo,
          rating: selectedTaskExtData?.rating,
        }}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onComplete={handleTaskComplete}
        onQuickComplete={handleQuickComplete}
      />
    </>
  );
}
