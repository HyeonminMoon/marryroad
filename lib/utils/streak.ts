/**
 * Calculate the current streak (consecutive days of activity).
 *
 * Rules:
 * - If today is in activeDates, streak includes today and counts backwards
 * - If yesterday is in activeDates but not today, streak starts from yesterday
 *   (the user hasn't done anything today YET but the streak is still alive)
 * - Otherwise streak is 0
 */
export function calculateStreak(activeDates: string[]): number {
  if (!activeDates || activeDates.length === 0) return 0;

  const sorted = [...activeDates].sort().reverse(); // Most recent first
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);

  // Determine starting point
  let startDate: Date;
  if (sorted[0] === todayStr) {
    startDate = today;
  } else if (sorted[0] === yesterdayStr) {
    startDate = yesterday;
  } else {
    return 0;
  }

  // Count consecutive days backwards from startDate
  const dateSet = new Set(sorted);
  let streak = 0;
  const current = new Date(startDate);

  while (dateSet.has(formatDate(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
