'use client';

import React, { useMemo } from 'react';
import { Flame, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeeklyProgressProps {
  activityCounts: Record<string, number>;
  activeDates: string[];
  weddingDate?: string;
  totalRemainingTasks: number;
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

/** Get Monday of the week containing the given date */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format date as YYYY-MM-DD */
function fmt(d: Date): string {
  return d.toISOString().split('T')[0];
}

/** Get daily counts for a week starting from monday */
function getWeekDailyCounts(monday: Date, activityCounts: Record<string, number>): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return activityCounts[fmt(d)] || 0;
  });
}

/** Calculate streak: consecutive days with activity ending today or yesterday */
function getStreak(activeDates: string[]): number {
  if (activeDates.length === 0) return 0;

  const sorted = [...new Set(activeDates)].sort().reverse();
  const today = fmt(new Date());
  const yesterday = fmt(new Date(Date.now() - 86400000));

  // Streak must include today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diffDays) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function WeeklyProgress({
  activityCounts,
  activeDates,
  weddingDate,
  totalRemainingTasks,
}: WeeklyProgressProps) {
  const { thisWeekCounts, thisWeekTotal, lastWeekTotal, diff, streak, weeklyPace } =
    useMemo(() => {
      const today = new Date();
      const thisMonday = getMonday(today);
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(lastMonday.getDate() - 7);

      const thisCounts = getWeekDailyCounts(thisMonday, activityCounts);
      const lastCounts = getWeekDailyCounts(lastMonday, activityCounts);
      const thisTotal = thisCounts.reduce((a, b) => a + b, 0);
      const lastTotal = lastCounts.reduce((a, b) => a + b, 0);

      let pace: number | null = null;
      if (weddingDate) {
        const wedding = new Date(weddingDate);
        const weeksLeft = Math.max(1, Math.ceil((wedding.getTime() - today.getTime()) / (7 * 86400000)));
        pace = Math.ceil(totalRemainingTasks / weeksLeft);
      }

      return {
        thisWeekCounts: thisCounts,
        thisWeekTotal: thisTotal,
        lastWeekTotal: lastTotal,
        diff: thisTotal - lastTotal,
        streak: getStreak(activeDates),
        weeklyPace: pace,
      };
    }, [activityCounts, activeDates, weddingDate, totalRemainingTasks]);

  const maxCount = Math.max(...thisWeekCounts, 1);

  // Don't show if no activity ever
  const hasAnyActivity = activeDates.length > 0;
  if (!hasAnyActivity && thisWeekTotal === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-purple-900/50"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          이번 주 활동
        </h3>
        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {thisWeekTotal}
          <span className="text-sm font-normal text-gray-500 ml-1">개 완료</span>
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {/* vs last week */}
        <div className="flex items-center gap-1">
          {diff > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : diff < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <Minus className="w-4 h-4 text-gray-400" />
          )}
          <span
            className={`font-medium ${
              diff > 0
                ? 'text-green-600 dark:text-green-400'
                : diff < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500'
            }`}
          >
            {diff > 0 ? `+${diff}` : diff === 0 ? '0' : diff}
          </span>
          <span className="text-gray-400 text-xs">vs 지난 주</span>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-orange-600 dark:text-orange-400">
              {streak}일
            </span>
            <span className="text-gray-400 text-xs">연속</span>
          </div>
        )}
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1.5 h-10 mb-1">
        {thisWeekCounts.map((count, i) => {
          const height = count > 0 ? Math.max(4, (count / maxCount) * 32) : 2;
          const isToday = i === ((new Date().getDay() + 6) % 7); // Adjust for Mon=0

          return (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{
                backgroundColor: count > 0
                  ? isToday
                    ? 'rgb(147, 51, 234)' // purple-600
                    : 'rgb(192, 132, 252)' // purple-400
                  : 'rgb(229, 231, 235)', // gray-200
              }}
            />
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {DAY_LABELS.map((label, i) => {
          const isToday = i === ((new Date().getDay() + 6) % 7);
          return (
            <span
              key={i}
              className={`flex-1 text-center text-[10px] ${
                isToday
                  ? 'font-bold text-purple-600 dark:text-purple-400'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Wedding pace recommendation */}
      {weeklyPace !== null && (
        <div className="mt-3 pt-3 border-t border-purple-200/50 dark:border-purple-800/50 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span>
            D-Day까지{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              주당 ~{weeklyPace}개
            </span>{' '}
            권장
          </span>
        </div>
      )}
    </motion.div>
  );
}
