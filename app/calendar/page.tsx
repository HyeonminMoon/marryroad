'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { Task } from '@/lib/types/quest';
import { parseRecommendedTiming, getTaskUrgency } from '@/lib/utils/dday';
import { CalendarDaySheet, CalendarDayTask } from '@/components/calendar/calendar-day-sheet';
import { UpcomingDeadlines } from '@/components/calendar/upcoming-deadlines';
import { TaskDetailSheet } from '@/components/quest/task-detail-sheet';
import { TaskExtendedData } from '@/lib/types/quest';
import confetti from 'canvas-confetti';

// Re-export type from the sheet component
type CalendarTask = CalendarDayTask;

export default function CalendarPage() {
  const { quests, progress, completeTask } = useQuestStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<CalendarDayTask | null>(null);
  const weddingDate = progress.weddingDate;

  // First/last day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Group all tasks by date (completed + planned)
  const { tasksByDate, stats } = useMemo(() => {
    const grouped: Record<string, CalendarTask[]> = {};
    let completedCount = 0;
    let plannedCount = 0;
    let overdueCount = 0;

    quests.forEach(quest => {
      const questProgress = progress.taskProgress[quest.id];
      const completedIds = questProgress?.completedTaskIds || [];

      quest.tasks.forEach(task => {
        const isCompleted = completedIds.includes(task.id);
        const extData = questProgress?.taskExtendedData?.[task.id];

        // Completed tasks with date
        if (isCompleted && extData?.completedDate) {
          const dateKey = extData.completedDate;
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push({
            ...task,
            questId: quest.id,
            completedDate: extData.completedDate,
            questTitle: quest.title,
            questColor: quest.color,
            questIcon: quest.icon,
            isPlanned: false,
          });
          completedCount++;
        }

        // Planned tasks (uncompleted, with wedding date)
        if (!isCompleted && weddingDate) {
          const daysBefore = parseRecommendedTiming(task.recommendedTiming);
          if (daysBefore === null) return;

          const wedding = new Date(weddingDate);
          const targetDate = new Date(wedding);
          targetDate.setDate(targetDate.getDate() - daysBefore);
          const dateKey = targetDate.toISOString().split('T')[0];

          const urgency = getTaskUrgency(task.recommendedTiming, weddingDate);

          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push({
            ...task,
            questId: quest.id,
            plannedDate: dateKey,
            questTitle: quest.title,
            questColor: quest.color,
            questIcon: quest.icon,
            isPlanned: true,
            urgency,
          });
          plannedCount++;
          if (urgency === 'overdue') overdueCount++;
        }
      });
    });

    return {
      tasksByDate: grouped,
      stats: { completed: completedCount, planned: plannedCount, overdue: overdueCount },
    };
  }, [quests, progress, weddingDate]);

  // Monthly stats for the viewed month
  const monthlyStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let completed = 0;
    let planned = 0;
    let cost = 0;

    for (const [dateKey, tasks] of Object.entries(tasksByDate)) {
      const d = new Date(dateKey);
      if (d.getFullYear() !== year || d.getMonth() !== month) continue;
      for (const task of tasks) {
        if (task.isPlanned) {
          planned++;
        } else {
          completed++;
          const tp = progress.taskProgress[task.questId];
          const taskCost = tp?.taskCosts?.[task.id];
          if (taskCost && taskCost > 0) cost += taskCost;
        }
      }
    }

    return { completed, planned, cost };
  }, [tasksByDate, currentDate, progress]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (dateKey: string) => {
    const tasksForDay = tasksByDate[dateKey];
    if (tasksForDay && tasksForDay.length > 0) {
      setSelectedDate(dateKey);
    }
  };

  const handleTaskClickFromSheet = (task: CalendarDayTask) => {
    setSelectedTask(task);
  };

  const handleTaskComplete = (taskId: string, data: {
    cost?: number;
    memo?: string;
    date?: string;
    vendorInfo?: TaskExtendedData['vendorInfo'];
    rating?: number;
  }) => {
    if (!selectedTask) return;
    completeTask(selectedTask.questId, taskId, data.cost, {
      memo: data.memo,
      completedDate: data.date || new Date().toISOString().split('T')[0],
      vendorInfo: data.vendorInfo,
      rating: data.rating,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleQuickComplete = (taskId: string) => {
    if (!selectedTask) return;
    completeTask(selectedTask.questId, taskId, undefined, {
      completedDate: new Date().toISOString().split('T')[0],
    });
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const renderDays = () => {
    const days = [];
    const daysInMonth = lastDayOfMonth.getDate();

    // Empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 md:h-32 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200/50 dark:border-gray-800/50" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      const tasksForDay = tasksByDate[dateKey] || [];
      const isToday = new Date().toDateString() === date.toDateString();

      const completedForDay = tasksForDay.filter(t => !t.isPlanned);
      const plannedForDay = tasksForDay.filter(t => t.isPlanned);
      const maxVisible = 2; // Mobile-friendly

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: day * 0.01 }}
          onClick={() => handleDayClick(dateKey)}
          className={`h-20 md:h-32 border border-gray-200/50 dark:border-gray-700/50 p-1 md:p-2 overflow-hidden hover:bg-purple-50/30 dark:hover:bg-gray-800/50 transition-colors ${
            tasksForDay.length > 0 ? 'cursor-pointer' : ''
          } ${
            isToday ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700' : 'bg-white/50 dark:bg-gray-900/30'
          }`}
        >
          <div className="flex items-center justify-between mb-0.5 md:mb-1">
            <span className={`text-xs md:text-sm font-semibold ${isToday ? 'text-purple-600 dark:text-purple-400' : ''}`}>
              {day}
            </span>
            <div className="flex gap-0.5">
              {completedForDay.length > 0 && (
                <span className="text-[9px] md:text-xs bg-green-500 text-white px-1 md:px-1.5 py-0.5 rounded-full leading-none">
                  {completedForDay.length}
                </span>
              )}
              {plannedForDay.length > 0 && (
                <span className="text-[9px] md:text-xs bg-purple-500 text-white px-1 md:px-1.5 py-0.5 rounded-full leading-none">
                  {plannedForDay.length}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            {tasksForDay.slice(0, maxVisible).map((task, idx) => {
              const Icon = getQuestIcon(task.questIcon);
              const isOverdue = task.isPlanned && task.urgency === 'overdue';

              return (
                <div
                  key={`${task.id}-${idx}`}
                  className={`text-[10px] md:text-xs p-0.5 md:p-1 rounded truncate flex items-center gap-0.5 md:gap-1 ${
                    task.isPlanned
                      ? isOverdue
                        ? 'border border-dashed border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30'
                        : 'border border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30'
                      : ''
                  }`}
                  style={
                    task.isPlanned
                      ? { color: isOverdue ? '#dc2626' : task.questColor }
                      : { backgroundColor: task.questColor + '20', color: task.questColor }
                  }
                >
                  <Icon className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  <span className="truncate">{task.title}</span>
                </div>
              );
            })}
            {tasksForDay.length > maxVisible && (
              <div className="text-[9px] md:text-xs text-gray-500 px-0.5 md:px-1">
                +{tasksForDay.length - maxVisible}
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col bg-gradient-to-br from-purple-50/30 via-white to-pink-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <Header />

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                캘린더
              </h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {weddingDate ? '완료 & 예정 일정을 확인하세요' : '완료한 작업을 날짜별로 확인하세요'}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-2 md:gap-3">
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg px-3 py-2 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50 text-center">
                <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">완료</div>
                <div className="text-lg md:text-2xl font-bold text-green-600">{stats.completed}</div>
              </div>
              {weddingDate && (
                <>
                  <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg px-3 py-2 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50 text-center">
                    <div className="text-[10px] md:text-xs text-gray-500 mb-0.5">예정</div>
                    <div className="text-lg md:text-2xl font-bold text-purple-600">{stats.planned}</div>
                  </div>
                  {stats.overdue > 0 && (
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg px-3 py-2 rounded-xl shadow-sm border border-red-200/50 dark:border-red-700/50 text-center">
                      <div className="text-[10px] md:text-xs text-red-500 mb-0.5">지연</div>
                      <div className="text-lg md:text-2xl font-bold text-red-600">{stats.overdue}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-3 md:p-4 rounded-xl shadow-sm border border-white/30 dark:border-gray-700/50">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 md:gap-4">
              <h2 className="text-base md:text-xl font-bold">{monthName}</h2>
              <Button variant="outline" size="sm" onClick={goToToday}>
                오늘
              </Button>
              {weddingDate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(weddingDate))}
                  className="text-pink-600 border-pink-300 hover:bg-pink-50"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  D-Day
                </Button>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Legend */}
          {weddingDate && (
            <div className="flex items-center gap-4 mt-3 px-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>완료</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span>예정</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>지연</span>
              </div>
            </div>
          )}
        </div>

        {/* Monthly insight bar */}
        {(monthlyStats.completed > 0 || monthlyStats.planned > 0) && (
          <div className="mb-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-xl border border-white/30 dark:border-gray-700/50 px-4 py-2.5 flex items-center gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium">이번 달</span>
            {monthlyStats.completed > 0 && (
              <span className="text-green-600 dark:text-green-400 font-bold">
                완료 {monthlyStats.completed}
              </span>
            )}
            {monthlyStats.planned > 0 && (
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                예정 {monthlyStats.planned}
              </span>
            )}
            {monthlyStats.cost > 0 && (
              <span className="ml-auto text-gray-600 dark:text-gray-300 font-bold">
                {monthlyStats.cost >= 10000
                  ? `${Math.round(monthlyStats.cost / 10000).toLocaleString()}만원`
                  : `${monthlyStats.cost.toLocaleString()}원`}
              </span>
            )}
          </div>
        )}

        {/* Upcoming deadlines */}
        <UpcomingDeadlines tasksByDate={tasksByDate} />

        {/* Calendar grid */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 overflow-hidden">
          {/* Day of week header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div
                key={day}
                className={`py-2 md:py-3 text-center font-semibold text-xs md:text-sm ${
                  idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7">
            {renderDays()}
          </div>
        </div>

        {/* Empty state */}
        {stats.completed === 0 && stats.planned === 0 && (
          <div className="mt-8 text-center p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            {weddingDate ? (
              <>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  아직 일정이 비어있어요
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  로드맵에서 태스크를 완료하면<br />결혼 준비 타임라인이 자동으로 채워져요
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  결혼 날짜를 먼저 설정해보세요
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  D-day가 정해지면 준비 일정이<br />달력에 자동으로 표시됩니다
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Day Detail Sheet */}
      <CalendarDaySheet
        date={selectedDate}
        tasks={selectedDate ? (tasksByDate[selectedDate] || []) : []}
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        onTaskClick={handleTaskClickFromSheet}
      />

      {/* Task Detail Sheet */}
      {selectedTask && (() => {
        const quest = quests.find(q => q.id === selectedTask.questId);
        if (!quest) return null;
        const questProgress = progress.taskProgress[quest.id];
        const isCompleted = questProgress?.completedTaskIds?.includes(selectedTask.id) || false;
        const taskCost = questProgress?.taskCosts?.[selectedTask.id];
        const taskExtData = questProgress?.taskExtendedData?.[selectedTask.id];

        return (
          <TaskDetailSheet
            task={selectedTask}
            quest={quest}
            isCompleted={isCompleted}
            existingData={{
              cost: taskCost,
              memo: taskExtData?.memo,
              date: taskExtData?.completedDate,
              vendorInfo: taskExtData?.vendorInfo,
              rating: taskExtData?.rating,
            }}
            open={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onComplete={handleTaskComplete}
            onQuickComplete={handleQuickComplete}
          />
        );
      })()}
    </div>
  );
}
