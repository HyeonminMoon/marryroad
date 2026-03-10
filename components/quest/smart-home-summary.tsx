'use client'

import { useMemo } from 'react'
import { Quest, QuestProgress } from '@/lib/types/quest'
import { getDdayCount } from '@/lib/utils/dday'
import { Sparkles, ArrowRight, CheckCircle2, Target } from 'lucide-react'
import { motion } from 'framer-motion'

interface SmartHomeSummaryProps {
  quests: Quest[]
  progress: QuestProgress
  onQuestClick?: (quest: Quest) => void
}

function getProgressMessage(percent: number): string {
  if (percent === 0) return '결혼 준비, 체크리스트가 아니라 여정이에요'
  if (percent <= 10) return '첫 발을 내디뎠어요! 시작이 반입니다'
  if (percent <= 20) return '좋은 시작이에요! 기초가 탄탄하면 나중이 편해요'
  if (percent <= 40) return '착착 진행 중! 꾸준함이 최고의 전략이에요'
  if (percent <= 60) return '절반을 향해 달려가고 있어요!'
  if (percent <= 80) return '후반에 접어들었어요. 마무리가 보입니다!'
  if (percent <= 95) return '거의 다 왔어요! 마무리만 남았습니다'
  return '완벽한 결혼식 준비가 거의 끝났어요!'
}

function getPaceFeedback(
  progressPercent: number,
  weddingDate: string | null
): { text: string; tone: 'good' | 'normal' | 'urgent' } | null {
  if (!weddingDate) return null
  const dday = getDdayCount(weddingDate)
  if (dday <= 0) return null // past wedding

  // Simple pace: if progress% >= time-elapsed%, user is ahead
  // Assume typical prep period is 12 months (365 days)
  const typicalDays = 365
  const daysElapsed = Math.max(0, typicalDays - dday)
  const expectedPercent = Math.min(100, (daysElapsed / typicalDays) * 100)

  if (progressPercent >= expectedPercent + 10) {
    return { text: '이 속도면 여유있게 준비할 수 있어요', tone: 'good' }
  }
  if (progressPercent >= expectedPercent - 10) {
    return { text: '적절한 속도로 진행 중이에요', tone: 'normal' }
  }
  return { text: '조금 서둘러야 할 수 있어요. 오늘 하나만 더!', tone: 'urgent' }
}

export function SmartHomeSummary({ quests, progress, onQuestClick }: SmartHomeSummaryProps) {
  // Calculate overall progress
  const { totalTasks, completedTasks, progressPercent } = useMemo(() => {
    let total = 0
    let completed = 0
    for (const quest of quests) {
      total += quest.tasks.length
      const tp = progress.taskProgress[quest.id]
      if (tp) completed += tp.completedTaskIds.length
    }
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { totalTasks: total, completedTasks: completed, progressPercent: pct }
  }, [quests, progress])

  // Find next recommended task
  const recommendation = useMemo(() => {
    const priorities = ['상', '중', '하'] as const
    for (const priority of priorities) {
      for (const quest of quests) {
        const status = quest.status
        if (status !== 'available' && status !== 'in-progress') continue
        const tp = progress.taskProgress[quest.id]
        const completedIds = tp?.completedTaskIds || []
        for (const task of quest.tasks) {
          if (completedIds.includes(task.id)) continue
          if (task.priority === priority) {
            return { quest, task }
          }
        }
      }
    }
    return null
  }, [quests, progress])

  // Recent achievements (last 3 days)
  const recentAchievements = useMemo(() => {
    const now = new Date()
    const threeDaysAgo = new Date(now)
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const cutoff = threeDaysAgo.toISOString().split('T')[0]

    const results: { date: string; taskTitle: string; questTitle: string; questIcon: string }[] = []

    for (const quest of quests) {
      const tp = progress.taskProgress[quest.id]
      if (!tp?.taskExtendedData) continue
      for (const taskId of tp.completedTaskIds) {
        const ext = tp.taskExtendedData[taskId]
        if (ext?.completedDate && ext.completedDate >= cutoff) {
          const task = quest.tasks.find(t => t.id === taskId)
          if (task) {
            results.push({
              date: ext.completedDate,
              taskTitle: task.title,
              questTitle: quest.title,
              questIcon: quest.icon,
            })
          }
        }
      }
    }

    results.sort((a, b) => b.date.localeCompare(a.date))
    return results.slice(0, 3)
  }, [quests, progress])

  const progressMessage = getProgressMessage(progressPercent)
  const paceFeedback = getPaceFeedback(progressPercent, progress.weddingDate)

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-sm border border-white/30 dark:border-gray-700/50 overflow-hidden">
      {/* Progress Section */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            결혼 준비 {progressPercent}% 완료
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400">{progressMessage}</p>
        {paceFeedback && (
          <p className={`text-xs mt-1 ${
            paceFeedback.tone === 'good' ? 'text-emerald-600 dark:text-emerald-400' :
            paceFeedback.tone === 'urgent' ? 'text-amber-600 dark:text-amber-400' :
            'text-gray-500'
          }`}>
            {paceFeedback.tone === 'good' ? '😊' : paceFeedback.tone === 'urgent' ? '💪' : '👍'} {paceFeedback.text}
          </p>
        )}
      </div>

      {/* Recommendation Section */}
      {recommendation && (
        <div className="mx-5 mb-4 p-3.5 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border-l-3 border-blue-400">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">오늘의 추천</span>
          </div>
          <button
            className="w-full text-left group"
            onClick={() => onQuestClick?.(recommendation.quest)}
          >
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {recommendation.task.title}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-gray-500">
                {recommendation.quest.icon} {recommendation.quest.title}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                시작 <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
          {recommendation.task.description && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
              {recommendation.task.description}
            </p>
          )}
        </div>
      )}

      {/* No recommendation - first visit CTA */}
      {!recommendation && progressPercent === 0 && (
        <div className="mx-5 mb-4 p-3.5 bg-purple-50/80 dark:bg-purple-950/30 rounded-xl text-center">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
            첫 태스크를 완료하면 여정이 시작됩니다
          </p>
          <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
            아래 퀘스트에서 하나를 골라보세요
          </p>
        </div>
      )}

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">최근 성과</span>
          </div>
          <div className="space-y-1.5">
            {recentAchievements.map((item, i) => {
              const today = new Date().toISOString().split('T')[0]
              const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
              const dateLabel = item.date === today ? '오늘' :
                item.date === yesterday ? '어제' :
                item.date.slice(5).replace('-', '/')

              return (
                <motion.div
                  key={`${item.date}-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-xs bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg px-2.5 py-1.5"
                >
                  <span className="text-emerald-500 font-medium w-8 flex-shrink-0">{dateLabel}</span>
                  <span className="text-gray-700 dark:text-gray-300 truncate">{item.taskTitle}</span>
                  <span className="text-gray-400 ml-auto flex-shrink-0">{item.questIcon}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
