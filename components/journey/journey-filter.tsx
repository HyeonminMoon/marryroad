'use client';

import { useMemo } from 'react';
import { Quest, JourneyEvent } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';

interface JourneyFilterProps {
  quests: Quest[];
  events: JourneyEvent[];
  selectedQuestId: string | null;
  onSelect: (questId: string | null) => void;
}

export function JourneyFilter({ quests, events, selectedQuestId, onSelect }: JourneyFilterProps) {
  // Only show quests that have events
  const questsWithEvents = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const e of events) {
      if (e.questId) {
        countMap.set(e.questId, (countMap.get(e.questId) || 0) + 1);
      }
    }

    return quests
      .filter(q => countMap.has(q.id))
      .map(q => ({
        ...q,
        eventCount: countMap.get(q.id) || 0,
      }));
  }, [quests, events]);

  if (questsWithEvents.length <= 1) return null;

  return (
    <div className="mb-6 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {/* "All" chip */}
        <button
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            selectedQuestId === null
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
              : 'bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm text-gray-600 dark:text-gray-300 border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60'
          }`}
        >
          전체
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            selectedQuestId === null
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {events.length}
          </span>
        </button>

        {/* Quest chips */}
        {questsWithEvents.map(q => {
          const Icon = getQuestIcon(q.icon);
          const isSelected = selectedQuestId === q.id;

          return (
            <button
              key={q.id}
              onClick={() => onSelect(isSelected ? null : q.id)}
              className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isSelected
                  ? 'text-white shadow-sm border-transparent'
                  : 'bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm text-gray-600 dark:text-gray-300 border-white/30 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/60'
              }`}
              style={isSelected ? { backgroundColor: q.color, borderColor: q.color } : undefined}
            >
              <Icon className="w-3 h-3" style={!isSelected ? { color: q.color } : undefined} />
              <span className="max-w-[80px] truncate">{q.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {q.eventCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
