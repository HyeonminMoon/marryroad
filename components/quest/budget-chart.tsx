'use client';

import { useMemo, useState } from 'react';
import { Quest, QuestProgress } from '@/lib/types/quest';
import { getSpendingByQuest } from '@/lib/utils/budget';
import { ChevronDown, ChevronUp, Wallet, Pencil, Check } from 'lucide-react';
import { useQuestStore } from '@/lib/stores/quest-store';
import { motion, AnimatePresence } from 'framer-motion';

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
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const usagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  // Build segment offsets
  let cumulativePercent = 0;
  const segmentData = segments.map((seg) => {
    const offset = cumulativePercent;
    cumulativePercent += seg.percentage;
    return { ...seg, offset };
  });

  const formatAmount = (amount: number) => {
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}만`;
    return amount.toLocaleString();
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-100 dark:text-gray-700"
          strokeWidth={strokeWidth}
        />
        {/* Segments */}
        {segmentData.map((seg, i) => {
          const dashLength = (seg.percentage / 100) * circumference;
          const dashOffset = -(seg.offset / 100) * circumference;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
        })}
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          className="fill-gray-900 dark:fill-gray-100 text-sm font-bold"
          fontSize="14"
        >
          {formatAmount(totalSpent)}원
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          className="fill-gray-400 dark:fill-gray-500"
          fontSize="11"
        >
          / {formatAmount(totalBudget)}원
        </text>
        <text
          x={size / 2}
          y={size / 2 + 28}
          textAnchor="middle"
          className="fill-gray-500 dark:fill-gray-400 font-medium"
          fontSize="11"
        >
          {usagePercent}% 사용
        </text>
      </svg>
    </div>
  );
}

export function BudgetChart({ quests, progress }: BudgetChartProps) {
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const setBudgetTotal = useQuestStore((s) => s.setBudgetTotal);

  const spending = useMemo(
    () => getSpendingByQuest(quests, progress),
    [quests, progress]
  );

  const hasSpending = spending.length > 0;
  const totalSpent = progress.budget.spent;
  const totalBudget = progress.budget.total;
  const remaining = totalBudget - totalSpent;

  const formatAmount = (amount: number) => {
    if (amount >= 10000) return `${(amount / 10000).toLocaleString()}만`;
    return amount.toLocaleString();
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">예산 현황</span>
          {hasSpending && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatAmount(totalSpent)}원 / {formatAmount(totalBudget)}원
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {!hasSpending ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    아직 기록된 비용이 없어요. 먼저 총 예산을 설정해보세요!
                  </p>
                  <div className="flex justify-center">
                    {editingBudget ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const v = parseFloat(budgetInput);
                              if (!isNaN(v) && v > 0) setBudgetTotal(v * 10000);
                              setEditingBudget(false);
                            }
                            if (e.key === 'Escape') setEditingBudget(false);
                          }}
                          autoFocus
                          className="w-24 text-right text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="만원"
                        />
                        <span className="text-xs text-gray-500">만원</span>
                        <button
                          onClick={() => {
                            const v = parseFloat(budgetInput);
                            if (!isNaN(v) && v > 0) setBudgetTotal(v * 10000);
                            setEditingBudget(false);
                          }}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setBudgetInput((totalBudget / 10000).toString());
                          setEditingBudget(true);
                        }}
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        총 예산 설정하기
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    현재 예산: {formatAmount(totalBudget)}원
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <DonutChart
                    segments={spending.map((s) => ({
                      color: s.questColor,
                      percentage: s.percentage,
                    }))}
                    totalSpent={totalSpent}
                    totalBudget={totalBudget}
                  />

                  {/* Legend */}
                  <div className="w-full space-y-2">
                    {spending.map((item) => (
                      <div key={item.questId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.questColor }}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {item.questTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatAmount(item.amount)}원
                          </span>
                          <span className="text-xs text-gray-400 w-10 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remaining */}
                  <div className={`w-full text-center text-sm font-medium pt-2 border-t border-gray-100 dark:border-gray-700 ${
                    remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {remaining >= 0
                      ? `남은 예산: ${formatAmount(remaining)}원`
                      : `예산 초과: ${formatAmount(Math.abs(remaining))}원`}
                  </div>

                  {/* Budget edit */}
                  <div className="w-full flex justify-center">
                    {editingBudget ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const v = parseFloat(budgetInput);
                              if (!isNaN(v) && v > 0) setBudgetTotal(v * 10000);
                              setEditingBudget(false);
                            }
                            if (e.key === 'Escape') setEditingBudget(false);
                          }}
                          autoFocus
                          className="w-24 text-right text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          placeholder="만원"
                        />
                        <span className="text-xs text-gray-500">만원</span>
                        <button
                          onClick={() => {
                            const v = parseFloat(budgetInput);
                            if (!isNaN(v) && v > 0) setBudgetTotal(v * 10000);
                            setEditingBudget(false);
                          }}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setBudgetInput((totalBudget / 10000).toString());
                          setEditingBudget(true);
                        }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        예산 수정
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
