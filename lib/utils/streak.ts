/**
 * Calculate the current streak (consecutive days of activity).
 *
 * Rules:
 * - If today is in activeDates, streak includes today and counts backwards
 * - If yesterday is in activeDates but not today, streak starts from yesterday
 *   (the user hasn't done anything today YET but the streak is still alive)
 * - Otherwise streak is 0
 */
export interface StreakInfo {
  current: number;
  best: number;
  isActiveToday: boolean;
}

export function calculateStreak(activeDates: string[]): StreakInfo {
  if (!activeDates || activeDates.length === 0) {
    return { current: 0, best: 0, isActiveToday: false };
  }

  const sorted = [...activeDates].sort().reverse(); // Most recent first
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(yesterday);
  const dateSet = new Set(sorted);

  const isActiveToday = dateSet.has(todayStr);

  // Determine starting point for current streak
  let startDate: Date;
  let current = 0;
  if (sorted[0] === todayStr) {
    startDate = today;
  } else if (sorted[0] === yesterdayStr) {
    startDate = yesterday;
  } else {
    startDate = today; // won't match, current stays 0
  }

  if (sorted[0] === todayStr || sorted[0] === yesterdayStr) {
    const cur = new Date(startDate);
    while (dateSet.has(formatDate(cur))) {
      current++;
      cur.setDate(cur.getDate() - 1);
    }
  }

  // Calculate best streak from sorted ascending
  const ascending = [...activeDates].sort();
  let best = ascending.length > 0 ? 1 : 0;
  let run = 1;
  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1]);
    const curr = new Date(ascending[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      run++;
    } else if (diff > 1) {
      best = Math.max(best, run);
      run = 1;
    }
  }
  best = Math.max(best, run);

  return { current, best, isActiveToday };
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
