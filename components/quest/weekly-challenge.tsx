'use client';

import { useMemo } from 'react';
import { QuestProgress } from '@/lib/types/quest';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Trophy, Zap, FileText, DollarSign, Flame, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  icon: React.ReactNode;
  title: string;
  current: number;
  target: number;
  xp: number;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = 0
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return monday.toISOString().split('T')[0];
}

function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function getDaysLeftInWeek(): number {
  const now = new Date();
  const day = now.getDay();
  // Sunday=0 → 0 days left, Saturday=6 → 1, Friday=5 → 2, etc.
  return day === 0 ? 0 : 7 - day;
}

function buildChallenges(progress: QuestProgress, weekDates: string[]): Challenge[] {
  // Count tasks completed this week
  const weekTaskCount = weekDates.reduce((sum, date) => {
    return sum + (progress.activityCounts[date] || 0);
  }, 0);

  // Count cost entries this week
  let costCount = 0;
  for (const qp of Object.values(progress.taskProgress)) {
    for (const [taskId, cost] of Object.entries(qp.taskCosts || {})) {
      const ext = qp.taskExtendedData?.[taskId];
      if (ext?.completedDate && weekDates.includes(ext.completedDate) && cost > 0) {
        costCount++;
      }
    }
  }

  // Count streak days this week
  const activeDaysThisWeek = weekDates.filter(d => progress.activeDates.includes(d)).length;

  return [
    {
      id: 'tasks-3',
      icon: <Zap className="w-4 h-4 text-purple-500" />,
      title: '이번 주 3개 완료',
      current: Math.min(weekTaskCount, 3),
      target: 3,
      xp: 25,
    },
    {
      id: 'tasks-5',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      title: '5개 이상 완료',
      current: Math.min(weekTaskCount, 5),
      target: 5,
      xp: 25,
    },
    {
      id: 'cost-1',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
      title: '비용 기록하기',
      current: Math.min(costCount, 1),
      target: 1,
      xp: 25,
    },
    {
      id: 'streak-3',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      title: '3일 연속 활동',
      current: Math.min(activeDaysThisWeek, 3),
      target: 3,
      xp: 25,
    },
  ];
}

export function WeeklyChallenge() {
  const { progress, claimWeeklyReward } = useQuestStore();
  const weekStart = getWeekStart();
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const challenges = useMemo(() => buildChallenges(progress, weekDates), [progress, weekDates]);
  const daysLeft = getDaysLeftInWeek();

  const claimedRewards = progress.weeklyChallenge.weekStart === weekStart
    ? progress.weeklyChallenge.claimedRewards
    : [];

  const completedCount = challenges.filter(c => c.current >= c.target).length;
  const claimedCount = claimedRewards.length;

  const handleClaim = (challengeId: string) => {
    claimWeeklyReward(challengeId, weekStart);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#6366f1'],
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-950/30 dark:to-pink-950/20 backdrop-blur-lg rounded-2xl border border-purple-200/30 dark:border-purple-800/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">주간 챌린지</span>
          <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded-full">
            {completedCount}/{challenges.length}
          </span>
        </div>
        <span className="text-[10px] text-gray-400">
          {daysLeft > 0 ? `${daysLeft}일 남음` : '이번 주 마지막 날'}
        </span>
      </div>

      {/* Challenge list */}
      <div className="space-y-2.5">
        {challenges.map((challenge, idx) => {
          const isComplete = challenge.current >= challenge.target;
          const isClaimed = claimedRewards.includes(challenge.id);
          const percent = Math.round((challenge.current / challenge.target) * 100);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-white/30 dark:border-gray-700/30"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-700/50 flex items-center justify-center">
                  {challenge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      isComplete ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {challenge.title}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {challenge.current}/{challenge.target}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                    />
                  </div>
                </div>

                {/* Claim button */}
                {isComplete && !isClaimed && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    onClick={() => handleClaim(challenge.id)}
                    className="flex-shrink-0 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-1.5 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm shadow-purple-200 dark:shadow-purple-900/50"
                  >
                    +{challenge.xp} XP
                  </motion.button>
                )}
                {isClaimed && (
                  <span className="flex-shrink-0 text-[10px] text-purple-400 font-medium">
                    ✓ 완료
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* All clear — badge celebration */}
      {claimedCount === challenges.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mt-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20 rounded-xl p-3 border border-yellow-200/50 dark:border-yellow-800/30 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm"
          >
            <Award className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
              🏆 주간 올클리어!
            </p>
            <p className="text-[10px] text-yellow-600/70 dark:text-yellow-400/70 mt-0.5">
              업적 &ldquo;주간 올클리어&rdquo; 뱃지를 확인하세요
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
