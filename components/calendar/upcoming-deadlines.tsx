'use client';

import { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getQuestIcon } from '@/lib/utils/icon-map';
import type { CalendarDayTask } from './calendar-day-sheet';

interface UpcomingDeadlinesProps {
  tasksByDate: Record<string, CalendarDayTask[]>;
}

const MAX_ITEMS = 5;

export function UpcomingDeadlines({ tasksByDate }: UpcomingDeadlinesProps) {
  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const items: { task: CalendarDayTask; date: string; daysUntil: number }[] = [];

    for (const [dateKey, tasks] of Object.entries(tasksByDate)) {
      if (dateKey < todayStr) continue;
      for (const task of tasks) {
        if (!task.isPlanned) continue;
        const targetDate = new Date(dateKey);
        targetDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        items.push({ task, date: dateKey, daysUntil });
      }
    }

    items.sort((a, b) => a.daysUntil - b.daysUntil);
    return items.slice(0, MAX_ITEMS);
  }, [tasksByDate]);

  if (upcoming.length === 0) return null;

  return (
    <div className="mb-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <Clock className="w-3.5 h-3.5 text-purple-500" />
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">다가오는 일정</span>
      </div>

      <div className="space-y-1.5">
        {upcoming.map((item, idx) => {
          const Icon = getQuestIcon(item.task.questIcon);
          const isUrgent = item.daysUntil <= 7;
          const isToday = item.daysUntil === 0;

          return (
            <motion.div
              key={`${item.task.id}-${item.date}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              <Icon
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: item.task.questColor }}
              />
              <span className="truncate flex-1 text-gray-700 dark:text-gray-300">
                {item.task.title}
              </span>
              <span className={`flex-shrink-0 font-bold tabular-nums ${
                isToday
                  ? 'text-red-500'
                  : isUrgent
                  ? 'text-amber-500'
                  : 'text-gray-400'
              }`}>
                {isToday ? '오늘' : `${item.daysUntil}일 후`}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
