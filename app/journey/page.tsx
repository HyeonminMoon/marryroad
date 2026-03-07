'use client';

import { useEffect } from 'react';
import { useQuestStore } from '@/lib/stores/quest-store';
import { extractJourneyEvents, calculateJourneyStats } from '@/lib/utils/journey';
import { Header } from '@/components/header';
import { JourneySummary } from '@/components/journey/journey-summary';
import { JourneyTimeline } from '@/components/journey/journey-timeline';
import { JourneyEmpty } from '@/components/journey/journey-empty';

export default function JourneyPage() {
  const { initialize, quests, progress } = useQuestStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const events = extractJourneyEvents(quests, progress);
  const stats = calculateJourneyStats(events, progress);
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
            <JourneyTimeline events={events} />
          </>
        ) : (
          <JourneyEmpty />
        )}
      </main>
    </div>
  );
}
