'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const WEEKS_TO_SHOW = 8;

interface WeekData {
  label: string;
  total: number;
  isCurrent: boolean;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

interface WeeklyTrendProps {
  activityCounts: Record<string, number>;
}

export function WeeklyTrend({ activityCounts }: WeeklyTrendProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const currentMonday = getMonday(today);
    const result: WeekData[] = [];

    for (let i = WEEKS_TO_SHOW - 1; i >= 0; i--) {
      const weekStart = new Date(currentMonday);
      weekStart.setDate(weekStart.getDate() - i * 7);

      let total = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + d);
        const key = day.toISOString().split('T')[0];
        total += activityCounts[key] || 0;
      }

      const month = weekStart.getMonth() + 1;
      const date = weekStart.getDate();

      result.push({
        label: `${month}/${date}`,
        total,
        isCurrent: i === 0,
      });
    }

    return result;
  }, [activityCounts]);

  const maxTotal = Math.max(...weeks.map(w => w.total), 1);
  const hasAnyActivity = weeks.some(w => w.total > 0);

  if (!hasAnyActivity) return null;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">활동 추이</span>
        <span className="ml-auto text-[10px] text-gray-400">최근 8주</span>
      </div>

      <div className="flex items-end justify-between gap-1.5 h-24">
        {weeks.map((week, idx) => {
          const heightPercent = (week.total / maxTotal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              {week.total > 0 && (
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">
                  {week.total}
                </span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPercent, week.total > 0 ? 8 : 2)}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`w-full rounded-t-sm ${
                  week.isCurrent
                    ? 'bg-gradient-to-t from-purple-500 to-purple-400'
                    : week.total > 0
                    ? 'bg-gray-300 dark:bg-gray-600'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
                style={{ minHeight: 2 }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-1.5">
        {weeks.map((week, idx) => (
          <span
            key={idx}
            className={`flex-1 text-center text-[9px] ${
              week.isCurrent
                ? 'text-purple-500 font-bold'
                : 'text-gray-400'
            }`}
          >
            {week.label}
          </span>
        ))}
      </div>
    </div>
  );
}
