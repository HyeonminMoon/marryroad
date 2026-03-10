'use client'

import { useState, useMemo } from 'react'
import { Quest, QuestProgress } from '@/lib/types/quest'
import { useQuestStore } from '@/lib/stores/quest-store'
import { PieChart, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface BudgetAllocationProps {
  quests: Quest[]
  progress: QuestProgress
}

function formatAmount(amount: number) {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억`
  if (amount >= 10000) return `${Math.round(amount / 10000).toLocaleString()}만`
  return amount.toLocaleString()
}

export function BudgetAllocation({ quests, progress }: BudgetAllocationProps) {
  const setCategoryBudget = useQuestStore((s) => s.setCategoryBudget)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Only show quests that have tasks with costs
  const categoriesWithCosts = useMemo(() => {
    return quests.filter(q =>
      q.tasks.some(t => t.typicalCostMin !== null || t.typicalCostMax !== null)
    )
  }, [quests])

  const allocated = useMemo(() => {
    return Object.values(progress.categoryBudgets || {}).reduce((sum, v) => sum + v, 0)
  }, [progress.categoryBudgets])

  const unallocated = progress.budget.total - allocated
  const allocationPercent = progress.budget.total > 0
    ? Math.round((allocated / progress.budget.total) * 100)
    : 0

  const handleSave = (questId: string) => {
    const v = parseInt(editValue)
    if (!isNaN(v) && v >= 0) {
      setCategoryBudget(questId, v * 10000)
    }
    setEditingId(null)
  }

  const getSpentForQuest = (questId: string) => {
    const tp = progress.taskProgress[questId]
    if (!tp) return 0
    return Object.values(tp.taskCosts || {}).reduce((sum, c) => sum + c, 0)
  }

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">카테고리별 예산</span>
        </div>
        <span className="text-xs text-gray-500">
          배분: {allocationPercent}%
        </span>
      </div>

      {/* Allocation bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, allocationPercent)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">
            배분: {formatAmount(allocated)}원
          </span>
          <span className={`text-[10px] ${unallocated < 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {unallocated >= 0 ? `미배분: ${formatAmount(unallocated)}원` : `초과: ${formatAmount(Math.abs(unallocated))}원`}
          </span>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-2.5">
        {categoriesWithCosts.map((quest) => {
          const budgetAmt = progress.categoryBudgets?.[quest.id] || 0
          const spent = getSpentForQuest(quest.id)
          const spentPercent = budgetAmt > 0 ? Math.min(100, Math.round((spent / budgetAmt) * 100)) : 0
          const isEditing = editingId === quest.id

          return (
            <div key={quest.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm">{quest.icon}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                    {quest.title}
                  </span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(quest.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                      className="w-16 text-right text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-800"
                      placeholder="만원"
                    />
                    <span className="text-[10px] text-gray-400">만</span>
                    <button onClick={() => handleSave(quest.id)} className="text-green-600 p-0.5">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(quest.id)
                      setEditValue(budgetAmt > 0 ? String(budgetAmt / 10000) : '')
                    }}
                    className="text-xs text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {budgetAmt > 0 ? `${formatAmount(budgetAmt)}원` : '설정'}
                  </button>
                )}
              </div>
              {budgetAmt > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${spentPercent}%`,
                        backgroundColor: spentPercent > 100 ? '#ef4444' : quest.color || '#6366f1',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {formatAmount(spent)} / {formatAmount(budgetAmt)}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {categoriesWithCosts.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-2">
          비용 데이터가 있는 카테고리가 없습니다
        </p>
      )}
    </div>
  )
}
