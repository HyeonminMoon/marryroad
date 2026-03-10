'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { calculateStreak } from '@/lib/utils/streak';

interface ActivityHeatmapProps {
  activeDates: string[];
  activityCounts: Record<string, number>;
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800/50';
  if (count === 1) return 'bg-purple-200 dark:bg-purple-900/60';
  if (count <= 3) return 'bg-purple-400 dark:bg-purple-700/80';
  return 'bg-purple-600 dark:bg-purple-500';
}


const DAY_LABELS = ['', '월', '', '수', '', '금', ''];
const WEEKS = 13; // ~90 days

export function ActivityHeatmap({ activeDates, activityCounts }: ActivityHeatmapProps) {
  const [open, setOpen] = useState(true);
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Find the start: go back to the Monday of (WEEKS) weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1) - startDate.getDay() + 1);
    // Adjust if getDay() is 0 (Sunday) — treat Sunday as day 7
    if (today.getDay() === 0) {
      startDate.setDate(startDate.getDate() - 7);
    }

    const grid: { date: string; count: number; isToday: boolean; isFuture: boolean }[][] = [];
    const monthLabels: { label: string; col: number }[] = [];

    let lastMonth = -1;
    const cursor = new Date(startDate);

    for (let week = 0; week < WEEKS; week++) {
      const col: typeof grid[0] = [];

      for (let day = 0; day < 7; day++) {
        const dateStr = cursor.toISOString().split('T')[0];
        const count = activityCounts[dateStr] || 0;
        const isToday = dateStr === todayStr;
        const isFuture = cursor > today;

        col.push({ date: dateStr, count, isToday, isFuture });

        // Track month labels (show at the first week of each month)
        const month = cursor.getMonth();
        if (month !== lastMonth && day === 0) {
          const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
          monthLabels.push({ label: monthNames[month], col: week });
          lastMonth = month;
        }

        cursor.setDate(cursor.getDate() + 1);
      }

      grid.push(col);
    }

    return { grid, monthLabels };
  }, [activityCounts]);

  const { current: currentStreak, best: longestStreak } = calculateStreak(activeDates || []);
  const totalActiveDays = (activeDates || []).length;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="text-lg">🌱</span>
          활동 기록
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Stats */}
          <div className="flex gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span>
              총 <strong className="text-gray-900 dark:text-gray-100">{totalActiveDays}</strong>일 활동
            </span>
            <span>
              현재 <strong className="text-orange-600 dark:text-orange-400">{currentStreak}</strong>일 연속
            </span>
            <span>
              최장 <strong className="text-green-600 dark:text-green-400">{longestStreak}</strong>일 연속
            </span>
          </div>

          {/* Heatmap Grid */}
          <div className="relative overflow-x-auto">
            {/* Month labels */}
            <div className="flex ml-8 mb-1" style={{ gap: '3px' }}>
              {Array.from({ length: WEEKS }).map((_, weekIdx) => {
                const monthLabel = monthLabels.find(m => m.col === weekIdx);
                return (
                  <div
                    key={weekIdx}
                    className="text-[10px] text-gray-400 dark:text-gray-500"
                    style={{ width: '14px', textAlign: 'center' }}
                  >
                    {monthLabel?.label || ''}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-0">
              {/* Day labels */}
              <div className="flex flex-col mr-1" style={{ gap: '3px' }}>
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-end"
                    style={{ width: '24px', height: '14px' }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex" style={{ gap: '3px' }}>
                {grid.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col" style={{ gap: '3px' }}>
                    {week.map((day, dayIdx) => (
                      <div
                        key={day.date}
                        className={`rounded-sm transition-colors ${
                          day.isFuture
                            ? 'bg-transparent'
                            : selectedDate === day.date
                            ? `${getIntensityClass(day.count)} ring-2 ring-blue-500 dark:ring-blue-400`
                            : day.isToday
                            ? `${getIntensityClass(day.count)} ring-2 ring-purple-400 dark:ring-purple-500`
                            : getIntensityClass(day.count)
                        } ${!day.isFuture && day.count > 0 ? 'cursor-pointer' : ''}`}
                        style={{ width: '14px', height: '14px' }}
                        onClick={() => {
                          if (!day.isFuture && day.count > 0) {
                            setSelectedDate(prev => prev === day.date ? null : day.date);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!day.isFuture) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-1">적음</span>
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800/50" />
              <div className="w-3 h-3 rounded-sm bg-purple-200 dark:bg-purple-900/60" />
              <div className="w-3 h-3 rounded-sm bg-purple-400 dark:bg-purple-700/80" />
              <div className="w-3 h-3 rounded-sm bg-purple-600 dark:bg-purple-500" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">많음</span>
            </div>
          </div>

          {/* Selected date detail */}
          {selectedDate && activityCounts[selectedDate] > 0 && (
            <div className="mt-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 border border-purple-200/50 dark:border-purple-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  {selectedDate}
                </span>
                <span className="text-xs text-purple-500 dark:text-purple-400">
                  {activityCounts[selectedDate]}개 완료
                </span>
              </div>
            </div>
          )}

          {/* Tooltip (fixed position) */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none bg-gray-900 text-white text-xs rounded-md px-2 py-1 shadow-lg"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {tooltip.date} · {tooltip.count > 0 ? `${tooltip.count}개 완료` : '활동 없음'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
