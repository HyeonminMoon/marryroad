'use client';

import { useMemo } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getQuestIcon } from '@/lib/utils/icon-map';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface QuestCost {
  questId: string;
  title: string;
  color: string;
  icon: string;
  total: number;
  percent: number;
}

interface CostBreakdownProps {
  quests: Quest[];
  progress: QuestProgress;
  activeQuestId?: string | null;
  onQuestClick?: (questId: string) => void;
}

export function CostBreakdown({ quests, progress, activeQuestId, onQuestClick }: CostBreakdownProps) {
  const { items, grandTotal } = useMemo(() => {
    const costMap = new Map<string, number>();

    for (const quest of quests) {
      const tp = progress.taskProgress[quest.id];
      if (!tp) continue;
      let questTotal = 0;
      for (const cost of Object.values(tp.taskCosts)) {
        if (cost > 0) questTotal += cost;
      }
      if (questTotal > 0) costMap.set(quest.id, questTotal);
    }

    const total = Array.from(costMap.values()).reduce((s, v) => s + v, 0);
    if (total === 0) return { items: [], grandTotal: 0 };

    const items: QuestCost[] = quests
      .filter(q => costMap.has(q.id))
      .map(q => ({
        questId: q.id,
        title: q.title,
        color: q.color,
        icon: q.icon,
        total: costMap.get(q.id)!,
        percent: Math.round((costMap.get(q.id)! / total) * 100),
      }))
      .sort((a, b) => b.total - a.total);

    return { items, grandTotal: total };
  }, [quests, progress]);

  if (items.length === 0) return null;

  const formatAmount = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
    if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만`;
    return n.toLocaleString();
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 p-5 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">비용 분석</span>
        <span className="ml-auto text-xs text-gray-500">총 {formatAmount(grandTotal)}원</span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const Icon = getQuestIcon(item.icon);
          return (
            <button
              key={item.questId}
              onClick={() => onQuestClick?.(item.questId)}
              className={`w-full text-left transition-all rounded-lg px-2 py-1.5 -mx-2 ${
                onQuestClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
              } ${activeQuestId === item.questId ? 'bg-gray-50 dark:bg-gray-800/50 ring-1 ring-purple-300 dark:ring-purple-700' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.color }} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {formatAmount(item.total)}원
                  </span>
                  <span className="text-[10px] text-gray-400 w-8 text-right">{item.percent}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
