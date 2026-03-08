import { Quest, QuestProgress } from '@/lib/types/quest';

export interface QuestSpending {
  questId: string;
  questTitle: string;
  questColor: string;
  amount: number;
  percentage: number;
}

/** Compute spending per quest from progress data */
export function getSpendingByQuest(
  quests: Quest[],
  progress: QuestProgress
): QuestSpending[] {
  const totalSpent = progress.budget.spent;
  const results: QuestSpending[] = [];

  for (const quest of quests) {
    const taskProgress = progress.taskProgress[quest.id];
    if (!taskProgress) continue;

    const questTotal = Object.values(taskProgress.taskCosts || {}).reduce(
      (sum, cost) => sum + cost,
      0
    );

    if (questTotal > 0) {
      results.push({
        questId: quest.id,
        questTitle: quest.title,
        questColor: quest.color || '#6366F1',
        amount: questTotal,
        percentage: totalSpent > 0 ? Math.round((questTotal / totalSpent) * 100) : 0,
      });
    }
  }

  // Sort by amount descending
  results.sort((a, b) => b.amount - a.amount);
  return results;
}
