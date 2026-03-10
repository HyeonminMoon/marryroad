'use client';

import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JourneyEvent } from '@/lib/types/quest';

interface MonthData {
  key: string; // "YYYY-MM"
  label: string; // "3월" etc
  year: number;
  count: number;
  topQuest: { title: string; color: string; count: number } | null;
}

interface JourneyMonthlyRecapProps {
  events: JourneyEvent[];
}

export function JourneyMonthlyRecap({ events }: JourneyMonthlyRecapProps) {
  const months = useMemo(() => {
    if (events.length === 0) return [];

    const grouped: Record<string, JourneyEvent[]> = {};
    for (const event of events) {
      const monthKey = event.date.slice(0, 7);
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(event);
    }

    const result: MonthData[] = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a)) // newest first
      .map(([key, monthEvents]) => {
        const [yearStr, monthStr] = key.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);

        // Find top quest by count
        const questCounts: Record<string, { title: string; color: string; count: number }> = {};
        for (const e of monthEvents) {
          if (!questCounts[e.questId]) {
            questCounts[e.questId] = { title: e.questTitle, color: e.questColor, count: 0 };
          }
          questCounts[e.questId].count++;
        }
        const topQuest = Object.values(questCounts).sort((a, b) => b.count - a.count)[0] || null;

        return {
          key,
          label: `${month}월`,
          year,
          count: monthEvents.length,
          topQuest,
        };
      });

    return result;
  }, [events]);

  if (months.length === 0) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">월별 요약</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {months.map((month, idx) => (
          <motion.div
            key={month.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="snap-start flex-shrink-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 px-4 py-3 min-w-[120px] shadow-sm"
          >
            <div className="text-xs text-gray-400 mb-0.5">
              {month.year !== currentYear ? `${month.year}` : ''}
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-gray-100">
              {month.label}
            </div>
            <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1">
              {month.count}건
            </div>
            {month.topQuest && (
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: month.topQuest.color }}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {month.topQuest.title}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
