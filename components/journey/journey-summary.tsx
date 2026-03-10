'use client';

import { Trophy, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneySummaryProps {
  completedTasks: number;
  totalTasks: number;
  completedQuests: number;
  totalQuests: number;
  totalCost: number;
  daysSinceStart: number;
  level: number;
}

function getMotivationalMessage(percent: number): string {
  if (percent === 0) return '첫 걸음을 내딛어볼까요?';
  if (percent < 10) return '좋은 시작이에요! 하나씩 해나가요.';
  if (percent < 25) return '순조롭게 진행 중이에요!';
  if (percent < 50) return '벌써 이만큼이나! 잘하고 있어요.';
  if (percent < 75) return '절반을 넘었어요! 곧 완성이에요.';
  if (percent < 100) return '거의 다 왔어요! 마지막 스퍼트!';
  return '축하해요! 모든 준비를 완료했어요!';
}

export function JourneySummary({
  completedTasks,
  totalTasks,
  completedQuests,
  totalQuests,
  totalCost,
  daysSinceStart,
  level,
}: JourneySummaryProps) {
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const message = getMotivationalMessage(percent);

  const formatCost = (amount: number) => {
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}만`;
    return amount.toLocaleString();
  };

  const stats = [
    {
      icon: CheckCircle,
      label: '완료',
      value: `${completedTasks}/${totalTasks}`,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      icon: Calendar,
      label: '경과',
      value: daysSinceStart > 0 ? `${daysSinceStart}일` : '-',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      icon: DollarSign,
      label: '지출',
      value: totalCost > 0 ? `${formatCost(totalCost)}원` : '-',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      icon: Trophy,
      label: '레벨',
      value: `Lv.${level}`,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 p-6 mb-8"
    >
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            우리의 여정
          </h2>
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {percent}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {message}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-3 text-center`}
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quest progress */}
      {completedQuests > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
          {totalQuests}개 퀘스트 중 {completedQuests}개 완료
        </p>
      )}
    </motion.div>
  );
}
