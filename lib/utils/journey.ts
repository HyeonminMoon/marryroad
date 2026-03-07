/**
 * Journey Timeline Data Extraction
 *
 * Transforms completed task data from the quest store into a sorted
 * timeline of JourneyEvent objects for the /journey page.
 */

import { Quest, QuestProgress, JourneyEvent } from '@/lib/types/quest';

/**
 * Extract journey events from quest progress data.
 * Returns events sorted by date (oldest first).
 */
export function extractJourneyEvents(
  quests: Quest[],
  progress: QuestProgress
): JourneyEvent[] {
  const events: JourneyEvent[] = [];

  for (const quest of quests) {
    const questTaskProgress = progress.taskProgress[quest.id];
    if (!questTaskProgress) continue;

    // Task completion events
    for (const taskId of questTaskProgress.completedTaskIds) {
      const task = quest.tasks.find(t => t.id === taskId);
      if (!task) continue;

      const extData = questTaskProgress.taskExtendedData?.[taskId];
      const cost = questTaskProgress.taskCosts?.[taskId];

      events.push({
        type: 'task',
        date: extData?.completedDate || '날짜 미기록',
        questId: quest.id,
        questTitle: quest.title,
        questColor: quest.color,
        questIcon: quest.icon,
        taskId: task.id,
        taskTitle: task.title,
        memo: extData?.memo,
        photos: extData?.photos,
        cost,
        vendorName: extData?.vendorInfo?.name,
        rating: extData?.rating,
      });
    }

    // Quest completion event
    if (progress.completedQuestIds.includes(quest.id)) {
      // Use the latest task completion date as the quest completion date
      const taskDates = questTaskProgress.completedTaskIds
        .map(tid => questTaskProgress.taskExtendedData?.[tid]?.completedDate)
        .filter(Boolean)
        .sort();
      const questDate = taskDates.length > 0
        ? taskDates[taskDates.length - 1]!
        : '날짜 미기록';

      events.push({
        type: 'quest-complete',
        date: questDate,
        questId: quest.id,
        questTitle: quest.title,
        questColor: quest.color,
        questIcon: quest.icon,
        xpEarned: quest.xp,
      });
    }
  }

  // Sort: dated events first (by date asc), undated events last
  events.sort((a, b) => {
    const aHasDate = a.date !== '날짜 미기록';
    const bHasDate = b.date !== '날짜 미기록';

    if (aHasDate && bHasDate) return a.date.localeCompare(b.date);
    if (aHasDate && !bHasDate) return -1;
    if (!aHasDate && bHasDate) return 1;
    return 0;
  });

  return events;
}

/**
 * Calculate journey statistics from events and progress.
 */
export function calculateJourneyStats(
  events: JourneyEvent[],
  progress: QuestProgress
) {
  const taskEvents = events.filter(e => e.type === 'task');
  const totalCost = taskEvents.reduce((sum, e) => sum + (e.cost || 0), 0);

  const datedEvents = taskEvents
    .filter(e => e.date !== '날짜 미기록')
    .map(e => e.date)
    .sort();

  const firstDate = datedEvents[0];
  const daysSinceStart = firstDate
    ? Math.ceil(
        (Date.now() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    completedTasks: taskEvents.length,
    completedQuests: progress.completedQuestIds.length,
    totalCost,
    daysSinceStart,
    level: progress.level,
    xp: progress.xp,
  };
}

/**
 * Group events by date for timeline rendering.
 */
export function groupEventsByDate(
  events: JourneyEvent[]
): { date: string; events: JourneyEvent[] }[] {
  const groups: Map<string, JourneyEvent[]> = new Map();

  for (const event of events) {
    const existing = groups.get(event.date);
    if (existing) {
      existing.push(event);
    } else {
      groups.set(event.date, [event]);
    }
  }

  return Array.from(groups.entries()).map(([date, events]) => ({
    date,
    events,
  }));
}
