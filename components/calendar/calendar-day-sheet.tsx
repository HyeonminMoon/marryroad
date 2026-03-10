'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { Task } from '@/lib/types/quest';
import { TaskUrgency } from '@/lib/utils/dday';
import { motion } from 'framer-motion';

export interface CalendarDayTask extends Task {
  questTitle: string;
  questColor: string;
  questIcon: string;
  questId: string;
  completedDate?: string;
  plannedDate?: string;
  isPlanned: boolean;
  urgency?: TaskUrgency;
}

interface CalendarDaySheetProps {
  date: string | null; // ISO date string
  tasks: CalendarDayTask[];
  open: boolean;
  onClose: () => void;
  onTaskClick: (task: CalendarDayTask) => void;
}

export function CalendarDaySheet({ date, tasks, open, onClose, onTaskClick }: CalendarDaySheetProps) {
  if (!date) return null;

  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const completed = tasks.filter(t => !t.isPlanned);
  const planned = tasks.filter(t => t.isPlanned);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="max-h-[70vh] overflow-y-auto rounded-t-2xl dark:bg-gray-900"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-3">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <SheetHeader className="text-left px-2">
          <SheetTitle className="text-lg">{formattedDate}</SheetTitle>
          <SheetDescription>
            {completed.length > 0 && `완료 ${completed.length}건`}
            {completed.length > 0 && planned.length > 0 && ' · '}
            {planned.length > 0 && `예정 ${planned.length}건`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-2 px-2 pb-4">
          {/* Completed tasks */}
          {completed.map((task, idx) => {
            const Icon = getQuestIcon(task.questIcon);
            return (
              <motion.button
                key={`c-${task.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onTaskClick(task)}
                className="w-full text-left flex items-center gap-3 bg-green-50/70 dark:bg-green-950/20 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 dark:border-green-800/30 hover:bg-green-100/70 dark:hover:bg-green-950/40 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: task.questColor + '20' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: task.questColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {task.questTitle}
                  </p>
                </div>
              </motion.button>
            );
          })}

          {/* Planned tasks */}
          {planned.map((task, idx) => {
            const Icon = getQuestIcon(task.questIcon);
            const isOverdue = task.urgency === 'overdue';
            const isDueSoon = task.urgency === 'due-soon';

            return (
              <motion.button
                key={`p-${task.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (completed.length + idx) * 0.04 }}
                onClick={() => onTaskClick(task)}
                className={`w-full text-left flex items-center gap-3 backdrop-blur-sm rounded-xl p-3 border transition-colors ${
                  isOverdue
                    ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30 hover:bg-red-100/70'
                    : isDueSoon
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/70'
                    : 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30 hover:bg-purple-100/70'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                )}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: task.questColor + '20' }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: task.questColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {task.questTitle}
                  </p>
                </div>
                {isOverdue && (
                  <span className="text-[10px] text-red-600 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    지연
                  </span>
                )}
              </motion.button>
            );
          })}

          {tasks.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              이 날짜에 일정이 없어요
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
