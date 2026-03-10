'use client'

import { useState, useEffect } from 'react'
import { useQuestStore } from '@/lib/stores/quest-store'
import { getDdayCount } from '@/lib/utils/dday'
import { DataManagement } from '@/components/quest/data-management'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Heart, Calendar, Wallet, Trash2, Check, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function SaveFeedback({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
        >
          <Check className="w-3.5 h-3.5" />
          저장됨
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function SettingsPage() {
  const progress = useQuestStore((s) => s.progress)
  const setCoupleNames = useQuestStore((s) => s.setCoupleNames)
  const setWeddingDate = useQuestStore((s) => s.setWeddingDate)
  const setBudgetTotal = useQuestStore((s) => s.setBudgetTotal)
  const resetProgress = useQuestStore((s) => s.resetProgress)

  // Local form state
  const [userName, setUserName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [weddingDate, setWeddingDateLocal] = useState('')
  const [budgetInput, setBudgetInput] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Initialize from store
  useEffect(() => {
    if (progress.coupleNames) {
      setUserName(progress.coupleNames.user)
      setPartnerName(progress.coupleNames.partner)
    }
    if (progress.weddingDate) {
      setWeddingDateLocal(progress.weddingDate)
    }
    setBudgetInput(String(Math.round(progress.budget.total / 10000)))
  }, [progress.coupleNames, progress.weddingDate, progress.budget.total])

  const showSaved = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(null), 2000)
  }

  const handleSaveCoupleNames = () => {
    if (!userName.trim() || !partnerName.trim()) return
    setCoupleNames(userName.trim(), partnerName.trim())
    showSaved('couple')
  }

  const handleSaveWeddingDate = () => {
    if (!weddingDate) return
    setWeddingDate(weddingDate)
    showSaved('date')
  }

  const handleClearWeddingDate = () => {
    setWeddingDate(null)
    setWeddingDateLocal('')
    showSaved('date')
  }

  const handleSaveBudget = () => {
    const value = parseInt(budgetInput)
    if (isNaN(value) || value <= 0) return
    setBudgetTotal(value * 10000)
    showSaved('budget')
  }

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
    window.location.reload()
  }

  const dday = progress.weddingDate ? getDdayCount(progress.weddingDate) : null
  const ddayLabel = dday !== null
    ? dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day!' : `D+${Math.abs(dday)}`
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/50">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">설정</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">결혼 준비 기본 정보를 관리합니다</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Couple Names */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">커플 정보</h2>
              </div>
              <SaveFeedback show={saved === 'couple'} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="userName" className="text-xs text-gray-500 mb-1.5">내 이름</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="이름 입력"
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="partnerName" className="text-xs text-gray-500 mb-1.5">상대방 이름</Label>
                <Input
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="이름 입력"
                  className="text-sm"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleSaveCoupleNames}
              disabled={!userName.trim() || !partnerName.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              저장
            </Button>
          </div>

          {/* Section 2: Wedding Date */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">결혼식 날짜</h2>
              </div>
              <SaveFeedback show={saved === 'date'} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDateLocal(e.target.value)}
                className="text-sm flex-1"
              />
              {ddayLabel && (
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  {ddayLabel}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveWeddingDate}
                disabled={!weddingDate}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                저장
              </Button>
              {progress.weddingDate && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearWeddingDate}
                  className="text-gray-500"
                >
                  날짜 초기화
                </Button>
              )}
            </div>
          </div>

          {/* Section 3: Budget */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">예산</h2>
              </div>
              <SaveFeedback show={saved === 'budget'} />
            </div>
            <div className="mb-4">
              <Label htmlFor="budget" className="text-xs text-gray-500 mb-1.5">총 예산 (만원)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="budget"
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="3000"
                  className="text-sm flex-1"
                  min={0}
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <span>현재 지출</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {(progress.budget.spent / 10000).toLocaleString()}만원
              </span>
            </div>
            <Button
              size="sm"
              onClick={handleSaveBudget}
              disabled={!budgetInput || parseInt(budgetInput) <= 0}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              저장
            </Button>
          </div>

          {/* Section 4: Data Management */}
          <DataManagement />

          {/* Section 5: Reset */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">데이터 초기화</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              모든 진행 상황, 설정, 하객 데이터를 삭제하고 처음부터 시작합니다. 이 작업은 되돌릴 수 없습니다.
            </p>

            <AnimatePresence>
              {showResetConfirm ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">정말 초기화하시겠습니까?</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleReset}
                    >
                      초기화
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      취소
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                  onClick={() => setShowResetConfirm(true)}
                >
                  전체 초기화
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
