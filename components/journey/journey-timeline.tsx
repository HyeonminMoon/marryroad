'use client';

import { JourneyEvent } from '@/lib/types/quest';
import { groupEventsByDate } from '@/lib/utils/journey';
import { JourneyCard } from './journey-card';
import { MilestoneMarker } from './milestone-marker';

interface JourneyTimelineProps {
  events: JourneyEvent[];
}

function formatDate(dateStr: string): string {
  if (dateStr === '날짜 미기록') return dateStr;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function JourneyTimeline({ events }: JourneyTimelineProps) {
  const grouped = groupEventsByDate(events);
  let cardIndex = 0;

  return (
    <div className="relative">
      {/* Center timeline line with glow */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-400 dark:from-pink-600 dark:via-purple-600 dark:to-indigo-600 md:-translate-x-px shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400/20 via-purple-400/20 to-indigo-400/20 md:-translate-x-0.5 blur-sm" />

      <div className="space-y-10">
        {grouped.map((group, groupIdx) => (
          <div key={group.date}>
            {/* Date separator line (skip first group) */}
            {groupIdx > 0 && (
              <div className="relative flex items-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800 to-transparent" />
              </div>
            )}
            {/* Date label */}
            <div className="relative flex items-center mb-4">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 z-10 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <div className="ml-10 md:ml-0 md:text-center md:w-full">
                <span className="inline-block bg-purple-100/80 dark:bg-purple-900/40 backdrop-blur-sm text-purple-700 dark:text-purple-300 text-sm font-bold px-4 py-1.5 rounded-full border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                  {formatDate(group.date)}
                  <span className="ml-2 text-[10px] font-normal text-purple-400 dark:text-purple-500">
                    {group.events.length}개
                  </span>
                </span>
              </div>
            </div>

            {/* Events for this date */}
            <div className="space-y-4 pl-10 md:pl-0">
              {group.events.map((event) => {
                if (event.type === 'quest-complete' || event.type === 'level-up') {
                  return (
                    <MilestoneMarker key={`${event.type}-${event.questId}`} event={event} />
                  );
                }

                const side = cardIndex % 2 === 0 ? 'left' : 'right';
                const idx = cardIndex;
                cardIndex++;

                return (
                  <div
                    key={`${event.taskId}`}
                    className="md:grid md:grid-cols-2 md:gap-8"
                  >
                    {side === 'right' && <div className="hidden md:block" />}
                    <JourneyCard event={event} index={idx} side={side} />
                    {side === 'left' && <div className="hidden md:block" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
