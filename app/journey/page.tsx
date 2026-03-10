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

  const events = useMemo(
    () => extractJourneyEvents(quests, progress),
    [quests, progress]
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {hasEvents ? (
          <>
            <JourneySummary
              completedTasks={stats.completedTasks}
              totalTasks={quests.reduce((sum, q) => sum + q.tasks.length, 0)}
              completedQuests={stats.completedQuests}
              totalQuests={quests.length}
              totalCost={stats.totalCost}
              daysSinceStart={stats.daysSinceStart}
              level={stats.level}
            />
            <JourneyMonthlyRecap events={events} />
            <JourneyFilter
              quests={quests}
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
