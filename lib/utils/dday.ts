import { Quest, QuestProgress } from '@/lib/types/quest';

export type TaskUrgency = 'overdue' | 'due-soon' | 'upcoming' | 'later';

export interface UrgentTask {
  questId: string;
  taskId: string;
  title: string;
  questTitle: string;
  questColor: string;
  questIcon: string;
  urgency: TaskUrgency;
  targetDate: Date;
  daysUntilTarget: number;
  recommendedTiming: string;
}

/** Parse "D-365", "D-180" etc. into number of days before wedding */
export function parseRecommendedTiming(timing: string): number | null {
  if (!timing) return null;
  const match = timing.match(/D-?(\d+)/i);
  if (!match) return null;
  return parseInt(match[1], 10);
}

/** Days from today until the wedding */
export function getDdayCount(weddingDate: string): number {
  const wedding = new Date(weddingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  wedding.setHours(0, 0, 0, 0);
  return Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Classify a task's urgency based on its timing and the wedding date */
export function getTaskUrgency(timing: string, weddingDate: string): TaskUrgency {
  const daysBefore = parseRecommendedTiming(timing);
  if (daysBefore === null) return 'later';

  const wedding = new Date(weddingDate);
  const targetDate = new Date(wedding);
  targetDate.setDate(targetDate.getDate() - daysBefore);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 14) return 'due-soon';
  if (daysUntil <= 60) return 'upcoming';
  return 'later';
}

/** Get all uncompleted tasks with urgency info, sorted by urgency then target date */
export function getUrgentTasks(
  quests: Quest[],
  progress: QuestProgress,
  weddingDate: string
): UrgentTask[] {
  const tasks: UrgentTask[] = [];
  const wedding = new Date(weddingDate);

  for (const quest of quests) {
    if (quest.status === 'locked') continue;

    const completedIds = progress.taskProgress[quest.id]?.completedTaskIds || [];

    for (const task of quest.tasks) {
      if (completedIds.includes(task.id)) continue;

      const daysBefore = parseRecommendedTiming(task.recommendedTiming);
      if (daysBefore === null) continue;

      const targetDate = new Date(wedding);
      targetDate.setDate(targetDate.getDate() - daysBefore);
      targetDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntilTarget = Math.ceil(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      const urgency = getTaskUrgency(task.recommendedTiming, weddingDate);

      tasks.push({
        questId: quest.id,
        taskId: task.id,
        title: task.title,
        questTitle: quest.title,
        questColor: quest.color || '#6366F1',
        questIcon: quest.icon,
        urgency,
        targetDate,
        daysUntilTarget,
        recommendedTiming: task.recommendedTiming,
      });
    }
  }

  // Sort: overdue first, then by target date ascending
  const urgencyOrder: Record<TaskUrgency, number> = {
    overdue: 0,
    'due-soon': 1,
    upcoming: 2,
    later: 3,
  };

  tasks.sort((a, b) => {
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgDiff !== 0) return urgDiff;
    return a.targetDate.getTime() - b.targetDate.getTime();
  });

  return tasks;
}
