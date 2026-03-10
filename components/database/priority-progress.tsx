'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface TaskLike {
  priority: string;
  isCompleted: boolean;
}

interface PriorityProgressProps {
  tasks: TaskLike[];
}

const PRIORITY_CONFIG = [
  { key: '상', label: '높음', color: 'from-red-500 to-red-400', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  { key: '중', label: '중간', color: 'from-yellow-500 to-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
  { key: '하', label: '낮음', color: 'from-gray-400 to-gray-300', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500 dark:text-gray-400' },
] as const;

export function PriorityProgress({ tasks }: PriorityProgressProps) {
  const stats = useMemo(() => {
    return PRIORITY_CONFIG.map(config => {
      const filtered = tasks.filter(t => t.priority === config.key);
      const total = filtered.length;
      const completed = filtered.filter(t => t.isCompleted).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...config, total, completed, percent };
    });
  }, [tasks]);

  const hasAnyTasks = stats.some(s => s.total > 0);
  if (!hasAnyTasks) return null;

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">우선순위별 진행</span>
      </div>

      <div className="space-y-3">
        {stats.map((stat, idx) => (
          stat.total > 0 && (
            <div key={stat.key} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-8 ${stat.text}`}>{stat.label}</span>
              <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-16 text-right tabular-nums">
                {stat.completed}/{stat.total}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
