'use client';

import { useMemo } from 'react';
import { CalendarClock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Quest, QuestProgress } from '@/lib/types/quest';

interface CompletionForecastProps {
  quests: Quest[];
  progress: QuestProgress;
}

export function CompletionForecast({ quests, progress }: CompletionForecastProps) {
  const forecast = useMemo(() => {
    const activeDates = progress.activeDates || [];
    if (activeDates.length < 3) return null;

    // Total tasks & completed tasks
    let totalTasks = 0;
    let completedTasks = 0;
    for (const quest of quests) {
      totalTasks += quest.tasks.length;
      completedTasks += progress.taskProgress[quest.id]?.completedTaskIds?.length || 0;
    }

    const remainingTasks = totalTasks - completedTasks;
    if (remainingTasks <= 0) return { done: true as const };

    // Calculate pace: completed tasks / active days
    const sorted = [...activeDates].sort();
    const firstDate = new Date(sorted[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = Math.max(1, Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
    const tasksPerDay = completedTasks / totalDays;

    if (tasksPerDay <= 0) return null;

    const daysRemaining = Math.ceil(remainingTasks / tasksPerDay);
    const estimatedDate = new Date(today);
    estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

    // Compare with wedding date
    let beforeWedding: boolean | null = null;
    let daysDiff: number | null = null;
    if (progress.weddingDate) {
      const wedding = new Date(progress.weddingDate);
      beforeWedding = estimatedDate <= wedding;
      daysDiff = Math.ceil((wedding.getTime() - estimatedDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      done: false as const,
      completedTasks,
      totalTasks,
      remainingTasks,
      tasksPerDay,
      daysRemaining,
      estimatedDate,
      beforeWedding,
      daysDiff,
    };
  }, [quests, progress]);

  if (!forecast) return null;

  if (forecast.done) {
    return (
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-green-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">모든 준비 완료!</span>
        </div>
      </div>
    );
  }

  const { completedTasks, totalTasks, remainingTasks, tasksPerDay, daysRemaining, estimatedDate, beforeWedding, daysDiff } = forecast;
  const percent = Math.round((completedTasks / totalTasks) * 100);

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">완료 예측</span>
        <span className="ml-auto text-[10px] text-gray-400">현재 속도 기준</span>
      </div>

      {/* Main forecast */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
          {formatDate(estimatedDate)}
        </span>
        <span className="text-xs text-gray-500">예상 완료</span>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
        <span>완료 {completedTasks}/{totalTasks} ({percent}%)</span>
        <span>·</span>
        <span>남은 {remainingTasks}개</span>
        <span>·</span>
        <span>일 {tasksPerDay.toFixed(1)}개 페이스</span>
      </div>

      {/* Wedding date comparison */}
      {beforeWedding !== null && daysDiff !== null && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
          beforeWedding
            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {beforeWedding ? (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              결혼식보다 {Math.abs(daysDiff)}일 여유 있어요
            </>
          ) : daysDiff === 0 ? (
            <>
              <Minus className="w-3.5 h-3.5" />
              결혼식 당일 완료 예상
            </>
          ) : (
            <>
              <TrendingDown className="w-3.5 h-3.5" />
              결혼식보다 {Math.abs(daysDiff)}일 늦을 수 있어요
            </>
          )}
        </div>
      )}
    </div>
  );
}
