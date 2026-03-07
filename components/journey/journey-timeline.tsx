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
      {/* Center timeline line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-700 dark:via-purple-700 dark:to-indigo-700 md:-translate-x-px" />

      <div className="space-y-8">
        {grouped.map((group) => (
          <div key={group.date}>
            {/* Date label */}
            <div className="relative flex items-center mb-4">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 z-10" />
              <div className="ml-10 md:ml-0 md:text-center md:w-full">
                <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
                  {formatDate(group.date)}
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
