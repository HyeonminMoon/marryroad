'use client';

import { useMemo, useState } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getSpendingByQuest } from '@/lib/utils/budget';
import { Wallet, Pencil, Check, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useQuestStore } from '@/lib/stores/quest-store';
import { motion } from 'framer-motion';

interface BudgetChartProps {
  quests: Quest[];
  progress: QuestProgress;
}

function DonutChart({
  segments,
  totalSpent,
  totalBudget,
}: {
  segments: { color: string; percentage: number }[];
  totalSpent: number;
  totalBudget: number;
}) {
  const size = 140;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const usagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  let cumulativePercent = 0;
  const segmentData = segments.map((seg) => {
    const offset = cumulativePercent;
    cumulativePercent += seg.percentage;
    return { ...seg, offset };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        className="text-gray-100 dark:text-gray-700"
        strokeWidth={strokeWidth}
      />
      {segmentData.map((seg, i) => {
        const dashLength = (seg.percentage / 100) * circumference;
        const dashOffset = -(seg.offset / 100) * circumference;
        return (
          <motion.circle
            key={i}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle"
        className="fill-gray-900 dark:fill-gray-100 font-bold" fontSize="18">
        {usagePercent}%
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle"
        className="fill-gray-400 dark:fill-gray-500" fontSize="10">
        사용
      </text>
    </svg>
  );
}

function getInsight(usagePercent: number, remaining: number, topCategory?: string) {
  if (usagePercent === 0) {
    return { emoji: '💰', message: '아직 지출이 없어요. 비용을 기록해보세요!', tone: 'neutral' as const };
  }
  if (remaining < 0) {
    return { emoji: '🚨', message: `예산을 ${formatAmount(Math.abs(remaining))}원 초과했어요`, tone: 'danger' as const };
  }
  if (usagePercent >= 80) {
    return { emoji: '⚠️', message: `예산의 ${usagePercent}%를 사용했어요. 남은 항목을 점검해보세요`, tone: 'warning' as const };
  }
  if (usagePercent >= 50) {
    return { emoji: '📊', message: topCategory ? `${topCategory}에 가장 많이 썼어요` : '절반 넘게 진행 중이에요', tone: 'info' as const };
  }
  return { emoji: '👍', message: '예산 사용이 순조로워요!', tone: 'good' as const };
}

function formatAmount(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억`;
  if (amount >= 10000) return `${Math.round(amount / 10000).toLocaleString()}만`;
  return amount.toLocaleString();
}

const INSIGHT_STYLES = {
  good: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300',
  info: 'from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/20 border-purple-200/50 dark:border-purple-800/30 text-purple-700 dark:text-purple-300',
  warning: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30 text-amber-700 dark:text-amber-300',
  danger: 'from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/20 border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-300',
  neutral: 'from-gray-50 to-gray-50 dark:from-gray-800/30 dark:to-gray-800/20 border-gray-200/50 dark:border-gray-700/30 text-gray-600 dark:text-gray-400',
};

export function BudgetChart({ quests, progress }: BudgetChartProps) {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const setBudgetTotal = useQuestStore((s) => s.setBudgetTotal);

  const spending = useMemo(
    () => getSpendingByQuest(quests, progress),
    [quests, progress]
  );

  const totalSpent = progress.budget.spent;
  const totalBudget = progress.budget.total;
  const remaining = totalBudget - totalSpent;
  const usagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const topCategory = spending.length > 0 ? spending[0].questTitle : undefined;
  const insight = getInsight(usagePercent, remaining, topCategory);

  const saveBudget = () => {
    const v = parseFloat(budgetInput);
    if (!isNaN(v) && v > 0) setBudgetTotal(v * 10000);
    setEditingBudget(false);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">예산 인사이트</span>
        </div>
        {editingBudget ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveBudget();
                if (e.key === 'Escape') setEditingBudget(false);
              }}
              autoFocus
              className="w-20 text-right text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="만원"
            />
            <span className="text-[10px] text-gray-500">만원</span>
            <button onClick={saveBudget} className="p-0.5 text-green-600 hover:text-green-700">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setBudgetInput((totalBudget / 10000).toString()); setEditingBudget(true); }}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {formatAmount(totalBudget)}원
          </button>
        )}
      </div>

      {/* Big number + Donut */}
      <div className="flex items-center gap-5 mb-4">
        <DonutChart
          segments={spending.map((s) => ({ color: s.questColor, percentage: s.percentage }))}
          totalSpent={totalSpent}
          totalBudget={totalBudget}
        />
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-gray-900 dark:text-gray-100"
          >
            {formatAmount(totalSpent)}<span className="text-sm font-medium text-gray-400">원</span>
          </motion.p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            총 {formatAmount(totalBudget)}원 중
          </p>
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
            remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {remaining >= 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            {remaining >= 0 ? `${formatAmount(remaining)}원 남음` : `${formatAmount(Math.abs(remaining))}원 초과`}
          </div>
        </div>
      </div>

      {/* Insight message */}
      <div className={`bg-gradient-to-r ${INSIGHT_STYLES[insight.tone]} rounded-xl p-3 border mb-4`}>
        <p className="text-xs font-medium flex items-center gap-1.5">
          <span className="text-base">{insight.emoji}</span>
          {insight.message}
        </p>
      </div>

      {/* Category bars */}
      {spending.length > 0 && (
        <div className="space-y-3">
          {spending.map((item, idx) => {
            const barPercent = totalBudget > 0 ? Math.min(100, Math.round((item.amount / totalBudget) * 100)) : 0;
            return (
              <motion.div
                key={item.questId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.questColor }} />
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                      {item.questTitle}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {formatAmount(item.amount)}원
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.questColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                  예산의 {barPercent}%
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {spending.length === 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">
            작업 완료 시 비용을 기록하면 인사이트가 생겨요
          </p>
        </div>
      )}
    </div>
  );
}
