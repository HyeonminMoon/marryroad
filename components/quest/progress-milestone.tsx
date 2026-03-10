'use client';

import { useMemo, useState, useEffect } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

const MILESTONES = [
  { threshold: 25, emoji: '🌱', title: '첫 발걸음', message: '벌써 1/4이나 완료했어요!', gradient: 'from-green-500/15 to-emerald-500/10 dark:from-green-950/30 dark:to-emerald-950/20', border: 'border-green-200/30 dark:border-green-800/30' },
  { threshold: 50, emoji: '🎯', title: '절반 돌파', message: '반이나 왔어요, 대단해요!', gradient: 'from-blue-500/15 to-cyan-500/10 dark:from-blue-950/30 dark:to-cyan-950/20', border: 'border-blue-200/30 dark:border-blue-800/30' },
  { threshold: 75, emoji: '🚀', title: '거의 다 왔어요', message: '결혼 준비의 3/4을 완료!', gradient: 'from-purple-500/15 to-violet-500/10 dark:from-purple-950/30 dark:to-violet-950/20', border: 'border-purple-200/30 dark:border-purple-800/30' },
  { threshold: 100, emoji: '🎉', title: '완벽한 준비', message: '모든 준비를 마쳤어요!', gradient: 'from-amber-500/15 to-yellow-500/10 dark:from-amber-950/30 dark:to-yellow-950/20', border: 'border-amber-200/30 dark:border-amber-800/30' },
];

const STORAGE_KEY = 'marryroad-dismissed-milestones';

interface ProgressMilestoneProps {
  quests: Quest[];
  progress: QuestProgress;
}

export function ProgressMilestone({ quests, progress }: ProgressMilestoneProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setDismissed(JSON.parse(stored));
  }, []);

  const { percent, milestone } = useMemo(() => {
    const total = quests.reduce((sum, q) => sum + q.tasks.length, 0);
    const completed = Object.values(progress.taskProgress).reduce(
      (sum, tp) => sum + tp.completedTaskIds.length, 0
    );
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Find highest reached milestone that isn't dismissed
    const reached = MILESTONES.filter(m => pct >= m.threshold && !dismissed.includes(m.threshold));
    const ms = reached.length > 0 ? reached[reached.length - 1] : null;

    return { percent: pct, milestone: ms };
  }, [quests, progress, dismissed]);

  // Confetti for 50%+ milestones
  useEffect(() => {
    if (milestone && milestone.threshold >= 50) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#ec4899', '#f59e0b'],
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [milestone]);

  const handleDismiss = () => {
    if (!milestone) return;
    const next = [...dismissed, milestone.threshold];
    setDismissed(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  if (!milestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={milestone.threshold}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`relative bg-gradient-to-r ${milestone.gradient} backdrop-blur-lg rounded-2xl border ${milestone.border} p-5`}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>

        <div className="flex items-center gap-4">
          <motion.span
            className="text-4xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
          >
            {milestone.emoji}
          </motion.span>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {milestone.title}
              </span>
              <span className="text-xs font-bold text-purple-500 dark:text-purple-400">
                {percent}%
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {milestone.message}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
