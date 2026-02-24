'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function CalendarPage() {
  const { quests, progress } = useQuestStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫날과 마지막 날
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // 모든 작업을 날짜별로 그룹화
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    quests.forEach(quest => {
      const questProgress = progress.taskProgress[quest.id];
      
      quest.tasks.forEach(task => {
        // 완료된 작업 중 날짜가 있는 것만 캘린더에 표시
        if (task.completedDate) {
          const dateKey = task.completedDate;
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push({
            ...task,
            questTitle: quest.title,
            questColor: quest.color,
            questIcon: quest.icon,
          });
        }
      });
    });

    return grouped;
  }, [quests, progress]);

  // 월 변경
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 날짜 렌더링
  const renderDays = () => {
    const days = [];
    const daysInMonth = lastDayOfMonth.getDate();

    // 빈 칸 추가 (이전 달)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" />
      );
    }

    // 실제 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      const tasksForDay = tasksByDate[dateKey] || [];
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`h-32 border border-gray-200 dark:border-gray-700 p-2 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isToday ? 'bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600' : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
              {day}
            </span>
            {tasksForDay.length > 0 && (
              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                {tasksForDay.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {tasksForDay.slice(0, 3).map((task, idx) => {
              const Icon = (Icons as any)[task.questIcon] || Icons.Circle;
              return (
                <div
                  key={idx}
                  className="text-xs p-1 rounded truncate flex items-center gap-1"
                  style={{ backgroundColor: task.questColor + '20', color: task.questColor }}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{task.title}</span>
                </div>
              );
            })}
            {tasksForDay.length > 3 && (
              <div className="text-xs text-gray-500 px-1">
                +{tasksForDay.length - 3} more
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const monthName = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  const totalCompletedTasks = Object.values(tasksByDate).flat().length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-purple-600" />
                캘린더 뷰
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                완료한 작업을 날짜별로 확인하세요
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">완료한 작업</div>
              <div className="text-2xl font-bold text-purple-600">{totalCompletedTasks}</div>
            </div>
          </div>

          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{monthName}</h2>
              <Button variant="outline" size="sm" onClick={goToToday}>
                오늘
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 캘린더 그리드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div
                key={day}
                className={`py-3 text-center font-semibold text-sm ${
                  idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7">
            {renderDays()}
          </div>
        </div>

        {/* 안내 메시지 */}
        {totalCompletedTasks === 0 && (
          <div className="mt-8 text-center p-8 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400">
              아직 완료한 작업이 없습니다.<br />
              로드맵에서 작업을 완료하고 날짜를 기록해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
