'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuestStore } from '@/lib/stores/quest-store';
import { extractJourneyEvents, calculateJourneyStats } from '@/lib/utils/journey';
import { Header } from '@/components/header';
import { JourneySummary } from '@/components/journey/journey-summary';
import { JourneyTimeline } from '@/components/journey/journey-timeline';
import { JourneyFilter } from '@/components/journey/journey-filter';
import { JourneyMonthlyRecap } from '@/components/journey/journey-monthly-recap';
import { JourneyEmpty } from '@/components/journey/journey-empty';

export default function JourneyPage() {
  const { initialize, quests, progress } = useQuestStore();
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const hiddenQuestIds = progress.hiddenQuestIds || [];

  // H-07: Filter out hidden quests before extracting journey events
  const visibleQuests = useMemo(
    () => quests.filter(q => !hiddenQuestIds.includes(q.id)),
    [quests, hiddenQuestIds]
  );

  const events = useMemo(
    () => extractJourneyEvents(visibleQuests, progress),
    [visibleQuests, progress]
  );
  const stats = useMemo(
    () => calculateJourneyStats(events, progress),
    [events, progress]
  );

  const filteredEvents = useMemo(
    () => selectedQuestId
      ? events.filter(e => e.questId === selectedQuestId)
      : events,
    [events, selectedQuestId]
  );

  const hasEvents = events.length > 0;

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {hasEvents ? (
          <>
            <JourneySummary
              completedTasks={stats.completedTasks}
              totalTasks={visibleQuests.reduce((sum, q) => sum + q.tasks.length, 0)}
              completedQuests={stats.completedQuests}
              totalQuests={visibleQuests.length}
              totalCost={stats.totalCost}
              daysSinceStart={stats.daysSinceStart}
              level={stats.level}
            />
            <JourneyMonthlyRecap events={events} />
            <JourneyFilter
              quests={visibleQuests}
              events={events}
              selectedQuestId={selectedQuestId}
              onSelect={setSelectedQuestId}
            />
            <JourneyTimeline events={filteredEvents} />
          </>
        ) : (
          <JourneyEmpty />
        )}
      </main>
    </div>
  );
}
