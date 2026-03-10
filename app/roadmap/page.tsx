'use client';

import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useQuestStore, calculateLevelProgress } from '@/lib/stores/quest-store';
import QuestPath from '@/components/quest/quest-path';
import { TodaySection } from '@/components/quest/today-section';
import { TaskModal } from '@/components/quest/task-modal';
import { CelebrationToast } from '@/components/quest/celebration-toast';
import { AchievementGrid } from '@/components/quest/achievement-grid';
import { AchievementToast } from '@/components/quest/achievement-toast';
import { DdayDashboard } from '@/components/quest/dday-dashboard';
import { BudgetChart } from '@/components/quest/budget-chart';
import { BudgetAllocation } from '@/components/quest/budget-allocation';
import { ActivityHeatmap } from '@/components/quest/activity-heatmap';
import { ProgressRing } from '@/components/quest/progress-ring';
import { WeeklyChallenge } from '@/components/quest/weekly-challenge';
import { DailyStreak } from '@/components/quest/daily-streak';
import { PreparationPace } from '@/components/quest/preparation-pace';
import { WeeklyTrend } from '@/components/quest/weekly-trend';
import { CompletionForecast } from '@/components/quest/completion-forecast';
import { QuestComparison } from '@/components/quest/quest-comparison';
import { WeddingDateNudge } from '@/components/quest/wedding-date-nudge';
import { SmartHomeSummary } from '@/components/quest/smart-home-summary';
import { QuestCompletionOverlay } from '@/components/quest/quest-completion-overlay';
import { CoupleSetup, DailyMessage } from '@/components/quest/couple-message';
import { getUnlockedAchievements, getNewAchievements, type AchievementDef } from '@/lib/data/achievements';
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
import { RotateCcw, AlertTriangle, Lock, Map, Route, Zap, Gamepad2, BarChart3, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quest } from '@/lib/types/quest';
import dynamic from 'next/dynamic';

const FullMapView = dynamic(
  () => import('@/components/quest/full-map-view').then(mod => ({ default: mod.FullMapView })),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96 text-gray-400">맵 로딩중...</div> }
);

type TabId = 'today' | 'quests' | 'stats';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'today', label: '오늘', icon: Zap },
  { id: 'quests', label: '퀘스트', icon: Gamepad2 },
  { id: 'stats', label: '통계', icon: BarChart3 },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function RoadmapPage() {
  const {
    initialize,
    quests,
    progress,
    resetProgress,
    completeTask,
    updateTaskMemo,
    setWeddingDate,
    grantAchievementXp,
    setCoupleNames,
    toggleHideQuest,
    uncompleteTask,
  } = useQuestStore();

  const visibleQuests = useMemo(
    () => quests.filter(q => !(progress.hiddenQuestIds || []).includes(q.id)),
    [quests, progress.hiddenQuestIds]
  );

  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const prevTabIndexRef = useRef(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<{ text: string; questId: string } | null>(null);
  const [viewMode, setViewMode] = useState<'path' | 'map'>('map');
  const [celebrationToast, setCelebrationToast] = useState<{
    visible: boolean;
    questId: string;
    taskId: string;
    taskTitle: string;
  }>({ visible: false, questId: '', taskId: '', taskTitle: '' });
  const [achievementToast, setAchievementToast] = useState<AchievementDef | null>(null);
  const achievementQueueRef = useRef<AchievementDef[]>([]);
  const [completedQuestOverlay, setCompletedQuestOverlay] = useState<Quest | null>(null);
  const prevCompletedQuestIdsRef = useRef<string[]>([]);
  const [editingCoupleNames, setEditingCoupleNames] = useState(false);
  const [undoToast, setUndoToast] = useState<{ questId: string; taskId: string; taskTitle: string } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [insightsExpanded, setInsightsExpanded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('marryroad-insights-expanded') === 'true';
  });
  const [coupleSetupDismissed, setCoupleSetupDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('marryroad-couple-setup-dismissed') === 'true';
  });

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Quest completion detection
  useEffect(() => {
    const prev = prevCompletedQuestIdsRef.current;
    const current = progress.completedQuestIds;

    if (prev.length > 0 && current.length > prev.length) {
      const newIds = current.filter(id => !prev.includes(id));
      if (newIds.length > 0) {
        const quest = quests.find(q => q.id === newIds[0]);
        if (quest) {
          setCompletedQuestOverlay(quest);
        }
      }
    }
    prevCompletedQuestIdsRef.current = current;
  }, [progress.completedQuestIds, quests]);

  // Achievement detection
  const unlockedAchievementIds = useMemo(
    () => getUnlockedAchievements(progress, quests),
    [progress, quests]
  );

  // Stats tab badge: check for unseen achievements
  const hasNewAchievements = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const seen: string[] = JSON.parse(localStorage.getItem('marryroad-seen-achievements') || '[]');
    return unlockedAchievementIds.some(id => !seen.includes(id));
  }, [unlockedAchievementIds]);

  useEffect(() => {
    if (quests.length === 0) return;

    const seenKey = 'marryroad-seen-achievements';
    const seen: string[] = JSON.parse(localStorage.getItem(seenKey) || '[]');
    const newAchievements = getNewAchievements(unlockedAchievementIds, seen);

    if (newAchievements.length > 0) {
      localStorage.setItem(seenKey, JSON.stringify(unlockedAchievementIds));

      const totalNewXp = newAchievements.reduce((sum, a) => sum + a.xp, 0);
      if (totalNewXp > 0) grantAchievementXp(totalNewXp);

      if (newAchievements.length >= 3 && seen.length === 0) {
        const best = newAchievements.sort((a, b) => b.xp - a.xp)[0];
        if (best && !achievementToast) setAchievementToast(best);
      } else {
        achievementQueueRef.current = [...achievementQueueRef.current, ...newAchievements];
        if (!achievementToast) {
          setAchievementToast(achievementQueueRef.current.shift() ?? null);
        }
      }
    }
  }, [unlockedAchievementIds, quests.length, achievementToast]);

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
        const text =
          prereqNames.length > 0
            ? `${prereqNames.join(', ')}을(를) 먼저 완료하세요.`
            : '이 퀘스트는 아직 잠겨 있습니다.';
        setLockedMessage({ text, questId: quest.id });
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

      const quest = quests.find(q => q.id === questId);
      const task = quest?.tasks.find(t => t.id === taskId);
      if (task) {
        // Show undo toast
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        setUndoToast({ questId, taskId, taskTitle: task.title });
        undoTimerRef.current = setTimeout(() => setUndoToast(null), 5000);

        setTimeout(() => {
          setCelebrationToast({
            visible: true,
            questId,
            taskId,
            taskTitle: task.title,
          });
        }, 300);
      }
    },
    [completeTask, quests]
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

  // Computed values
  const totalQuests = visibleQuests.length;
  const completedQuests = progress.completedQuestIds.length;
  const lvlProgress = calculateLevelProgress(progress.xp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Sticky: Progress Ring + Tab Bar */}
      <div className="sticky top-16 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto px-4 py-2">
          <ProgressRing
            progress={progress}
            totalQuests={totalQuests}
            completedQuests={completedQuests}
            currentLevelXp={lvlProgress.currentLevelXp}
            nextLevelXp={lvlProgress.nextLevelXp}
          />
        </div>

        {/* Tab Bar */}
        <div className="max-w-lg mx-auto px-4">
          <div className="flex relative">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              return (
              <button
                key={tab.id}
                onClick={() => {
                  prevTabIndexRef.current = TABS.findIndex(t => t.id === activeTab);
                  setActiveTab(tab.id);
                  if (tab.id === 'stats' && hasNewAchievements) {
                    localStorage.setItem('marryroad-seen-achievements', JSON.stringify(unlockedAchievementIds));
                  }
                }}
                className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors relative flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'stats' && hasNewAchievements && activeTab !== 'stats' && (
                  <span className="absolute top-1.5 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
        {/* TODAY TAB */}
        {activeTab === 'today' && (
          <motion.div
            key="today"
            initial={{ opacity: 0, x: (TABS.findIndex(t => t.id === 'today') - prevTabIndexRef.current) * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Couple Message / Setup */}
            {progress.coupleNames && !editingCoupleNames ? (
              <DailyMessage
                userName={progress.coupleNames.user}
                partnerName={progress.coupleNames.partner}
                onEditNames={() => setEditingCoupleNames(true)}
              />
            ) : (editingCoupleNames || !coupleSetupDismissed) ? (
              <CoupleSetup
                onSave={(user, partner) => {
                  setCoupleNames(user, partner);
                  setEditingCoupleNames(false);
                }}
                onSkip={() => {
                  setEditingCoupleNames(false);
                  setCoupleSetupDismissed(true);
                  localStorage.setItem('marryroad-couple-setup-dismissed', 'true');
                }}
              />
            ) : null}

            {/* Wedding date nudge — only when not set */}
            {!progress.weddingDate && (
              <WeddingDateNudge onSetDate={setWeddingDate} />
            )}

            <SmartHomeSummary
              quests={visibleQuests}
              progress={progress}
              onQuestClick={onQuestClick}
            />

            <TodaySection
              quests={visibleQuests}
              progress={progress}
              onTaskQuickComplete={onTaskQuickComplete}
              onQuestClick={onQuestClick}
            />

            {/* Collapsible Insights Section */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/50 shadow-sm overflow-hidden">
              <button
                onClick={() => {
                  const next = !insightsExpanded;
                  setInsightsExpanded(next);
                  localStorage.setItem('marryroad-insights-expanded', String(next));
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span>활동 인사이트</span>
                <motion.div animate={{ rotate: insightsExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {insightsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <DailyStreak activeDates={progress.activeDates || []} />
                      <WeeklyChallenge />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* QUESTS TAB */}
        {activeTab === 'quests' && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, x: (TABS.findIndex(t => t.id === 'quests') - prevTabIndexRef.current) * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <DdayDashboard
              quests={visibleQuests}
              progress={progress}
              onSetWeddingDate={setWeddingDate}
              onQuestClick={onQuestClick}
            />

            <PreparationPace quests={visibleQuests} progress={progress} />

            {/* Desktop: show map/path toggle */}
            {!isMobile && (
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
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
            )}

            {/* Quest View */}
            {isMobile || viewMode === 'path' ? (
              <div className="relative" style={{ minHeight: '60vh' }}>
                <QuestPath
                  quests={visibleQuests}
                  progress={progress}
                  onQuestClick={onQuestClick}
                />
              </div>
            ) : (
              <div className="max-w-6xl -mx-4 px-4">
                <FullMapView onQuestClick={onQuestClick} />
              </div>
            )}

            {/* Mobile reset button */}
            {isMobile && (
              <div className="flex justify-center pt-4">
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
            )}
          </motion.div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: (TABS.findIndex(t => t.id === 'stats') - prevTabIndexRef.current) * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <WeeklyTrend activityCounts={progress.activityCounts || {}} />
            <CompletionForecast quests={visibleQuests} progress={progress} />
            <QuestComparison quests={visibleQuests} progress={progress} onQuestClick={onQuestClick} />
            <ActivityHeatmap
              activeDates={progress.activeDates || []}
              activityCounts={progress.activityCounts || {}}
            />
            <AchievementGrid unlockedIds={unlockedAchievementIds} />
            <BudgetChart quests={visibleQuests} progress={progress} />
            <BudgetAllocation quests={visibleQuests} progress={progress} />
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Undo toast */}
      {undoToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-gray-700">
            <p className="text-sm truncate max-w-[200px]">{undoToast.taskTitle}</p>
            <button
              onClick={() => {
                uncompleteTask(undoToast.questId, undoToast.taskId);
                setUndoToast(null);
                if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
              }}
              className="text-sm font-bold text-purple-300 hover:text-purple-200 whitespace-nowrap"
            >
              되돌리기
            </button>
          </div>
        </div>
      )}

      {/* Locked quest toast */}
      {lockedMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 max-w-md">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm flex-1">{lockedMessage.text}</p>
            <button
              onClick={() => {
                const quest = quests.find(q => q.id === lockedMessage.questId);
                if (quest) {
                  setSelectedQuest(quest);
                  setModalOpen(true);
                }
                setLockedMessage(null);
              }}
              className="text-xs text-purple-300 hover:text-purple-200 font-medium whitespace-nowrap ml-2"
            >
              그래도 열기
            </button>
            <button
              onClick={() => setLockedMessage(null)}
              className="text-gray-500 hover:text-gray-300 ml-1"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Reset dialog */}
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

      {/* Achievement Toast */}
      <AchievementToast
        achievement={achievementToast}
        onDismiss={() => {
          const next = achievementQueueRef.current.shift();
          setAchievementToast(next ?? null);
        }}
      />

      {/* Quest Completion Overlay */}
      <QuestCompletionOverlay
        quest={completedQuestOverlay}
        onDismiss={() => setCompletedQuestOverlay(null)}
      />

      {/* Celebration Memo Toast */}
      <CelebrationToast
        visible={celebrationToast.visible}
        taskTitle={celebrationToast.taskTitle}
        showJourneyLink={Object.values(progress.taskProgress).reduce(
          (sum, tp) => sum + tp.completedTaskIds.length, 0
        ) >= 5}
        onSaveMemo={(memo) => {
          updateTaskMemo(celebrationToast.questId, celebrationToast.taskId, memo);
        }}
        onDismiss={() => setCelebrationToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
