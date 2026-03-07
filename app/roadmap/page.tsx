'use client';

import { useEffect, useCallback, useState } from 'react';
import { useQuestStore, calculateLevelProgress } from '@/lib/stores/quest-store';
import QuestPath from '@/components/quest/quest-path';
import { TodaySection } from '@/components/quest/today-section';
import { TaskModal } from '@/components/quest/task-modal';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RotateCcw, Trophy, AlertTriangle, Lock, Pencil, Check, Map, Route } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quest } from '@/lib/types/quest';
import dynamic from 'next/dynamic';

const FullMapView = dynamic(
  () => import('@/components/quest/full-map-view').then(mod => ({ default: mod.FullMapView })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96 text-gray-400">맵 로딩중...</div> }
);

export default function RoadmapPage() {
  const {
    initialize,
    quests,
    progress,
    resetProgress,
    completeTask,
    setBudgetTotal,
  } = useQuestStore();

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'path' | 'map'>('path');
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle quest click
  const onQuestClick = useCallback(
    (quest: Quest) => {
      if (quest.status === 'locked') {
        const { quests: allQuests } = useQuestStore.getState();
        const prereqNames = quest.dependencies
          .filter((depId: string) => !progress.completedQuestIds.includes(depId))
          .map((depId: string) => {
            const dep = allQuests.find((q: Quest) => q.id === depId);
            return dep ? `"${dep.title}"` : depId;
          });
        const message =
          prereqNames.length > 0
            ? `이 퀘스트를 시작하려면 ${prereqNames.join(', ')}을(를) 먼저 완료하세요.`
            : '이 퀘스트는 아직 잠겨 있습니다.';
        setLockedMessage(message);
        setTimeout(() => setLockedMessage(null), 3500);
        return;
      }

      setSelectedQuest(quest);
      setModalOpen(true);
    },
    [progress.completedQuestIds]
  );

  // Quick complete task from TodaySection
  const onTaskQuickComplete = useCallback(
    (questId: string, taskId: string) => {
      completeTask(questId, taskId);
    },
    [completeTask]
  );

  const handleReset = useCallback(() => {
    setResetDialogOpen(true);
  }, []);

  const confirmReset = useCallback(() => {
    resetProgress();
    setResetDialogOpen(false);
  }, [resetProgress]);

  // Level up effect
  useEffect(() => {
    const prevLevel = parseInt(localStorage.getItem('prevLevel') || '1');
    if (progress.level > prevLevel) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      localStorage.setItem('prevLevel', progress.level.toString());
    }
  }, [progress.level]);

  // Budget edit handlers
  const startEditBudget = () => {
    setBudgetInput((progress.budget.total / 10000).toString());
    setEditingBudget(true);
  };

  const saveBudget = () => {
    const value = parseFloat(budgetInput);
    if (!isNaN(value) && value > 0) {
      setBudgetTotal(value * 10000);
    }
    setEditingBudget(false);
  };

  const handleBudgetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveBudget();
    if (e.key === 'Escape') setEditingBudget(false);
  };

  // Computed values
  const totalQuests = quests.length;
  const completedQuests = progress.completedQuestIds.length;
  const overallProgress =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  const lvlProgress = calculateLevelProgress(progress.xp);

  const formatBudget = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toLocaleString()}만`;
    }
    return amount.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* 상단: 진행률 바 + 레벨/XP */}
      <div className="sticky top-16 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto px-4 py-3">
          {/* 레벨 뱃지 + XP + 예산 */}
          <div className="flex items-center justify-between mb-2">
            {/* 레벨 뱃지 */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">레벨 {progress.level}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {lvlProgress.currentLevelXp} / {lvlProgress.nextLevelXp} XP
                </p>
              </div>
            </div>

            {/* 예산 요약 */}
            <div className="text-right">
              {editingBudget ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    onKeyDown={handleBudgetKeyDown}
                    onBlur={saveBudget}
                    autoFocus
                    className="w-20 text-right text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="만원"
                  />
                  <span className="text-xs text-gray-500">만원</span>
                  <button
                    onClick={saveBudget}
                    className="p-0.5 text-green-600 hover:text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditBudget}
                  className="group flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <span>
                    {formatBudget(progress.budget.spent)}원 / {formatBudget(progress.budget.total)}원
                  </span>
                  <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          </div>

          {/* 전체 진행률 바 */}
          <div className="relative">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedQuests}/{totalQuests} 퀘스트
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {overallProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인: Today 섹션 + Quest Path / Full Map */}
      <div className={`mx-auto px-4 py-6 ${viewMode === 'path' ? 'max-w-lg' : 'max-w-6xl'}`}>
        {/* 뷰 전환 + 초기화 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('path')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'path'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              경로
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              전체 맵
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            초기화
          </Button>
        </div>

        {viewMode === 'path' ? (
          <>
            {/* Today Section */}
            <TodaySection
              quests={quests}
              progress={progress}
              onTaskQuickComplete={onTaskQuickComplete}
              onQuestClick={onQuestClick}
            />

            {/* Quest Path */}
            <div className="relative" style={{ minHeight: '60vh' }}>
              <QuestPath
                quests={quests}
                progress={progress}
                onQuestClick={onQuestClick}
              />
            </div>
          </>
        ) : (
          /* Full Map View (ReactFlow DAG) */
          <FullMapView onQuestClick={onQuestClick} />
        )}
      </div>

      {/* 잠긴 퀘스트 클릭 시 토스트 알림 */}
      {lockedMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 max-w-md">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm">{lockedMessage}</p>
          </div>
        </div>
      )}

      {/* 초기화 확인 모달 */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              진행 상황 초기화
            </DialogTitle>
            <DialogDescription>
              정말 모든 진행 상황을 초기화하시겠습니까? 완료한 퀘스트, XP, 예산
              기록이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Modal */}
      <TaskModal
        quest={selectedQuest}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedQuest(null);
        }}
      />
    </div>
  );
}
