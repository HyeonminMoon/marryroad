'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestStore } from '@/lib/stores/quest-store';
import { Heart, Calendar, ArrowRight, Sparkles, CheckCircle, Minus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestIcon } from '@/lib/utils/icon-map';
import questsData from '@/lib/data/quests.json';
import type { Quest } from '@/lib/types/quest';

const QUESTS = questsData as Quest[];

type QuestSetupState = 'none' | 'partial' | 'done';

export default function WelcomePage() {
  const router = useRouter();
  const { setCoupleNames, setWeddingDate, bulkCompleteQuest, completeTask } = useQuestStore();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [dateInput, setDateInput] = useState('');

  // Quick setup state
  const [questStates, setQuestStates] = useState<Record<string, QuestSetupState>>(() => {
    const init: Record<string, QuestSetupState> = {};
    QUESTS.forEach(q => { init[q.id] = 'none'; });
    return init;
  });
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Record<string, Set<string>>>({});
  const [isApplying, setIsApplying] = useState(false);

  // Count summary for quick setup
  const setupSummary = useMemo(() => {
    let taskCount = 0;
    QUESTS.forEach(q => {
      if (questStates[q.id] === 'done') {
        taskCount += q.tasks.length;
      } else if (questStates[q.id] === 'partial') {
        taskCount += selectedTasks[q.id]?.size || 0;
      }
    });
    return taskCount;
  }, [questStates, selectedTasks]);

  const handleStep1 = () => {
    if (userName.trim() && partnerName.trim()) {
      setCoupleNames(userName.trim(), partnerName.trim());
      localStorage.setItem('marryroad-couple-setup-dismissed', 'true');
      setStep(2);
    }
  };

  const handleStep2 = () => {
    if (dateInput) {
      setWeddingDate(dateInput);
    }
    setStep(3);
  };

  const handleSkipToRoadmap = () => {
    if (dateInput) setWeddingDate(dateInput);
    router.replace('/roadmap');
  };

  const handleStartFresh = () => {
    router.replace('/roadmap');
  };

  const handleStartQuickSetup = () => {
    setStep(4);
  };

  const toggleQuestState = (questId: string, newState: QuestSetupState) => {
    setQuestStates(prev => ({ ...prev, [questId]: newState }));
    if (newState === 'partial') {
      setExpandedQuestId(questId);
    } else if (expandedQuestId === questId) {
      setExpandedQuestId(null);
    }
  };

  const toggleTask = (questId: string, taskId: string) => {
    setSelectedTasks(prev => {
      const current = new Set(prev[questId] || []);
      if (current.has(taskId)) {
        current.delete(taskId);
      } else {
        current.add(taskId);
      }
      return { ...prev, [questId]: current };
    });
  };

  const handleApplySetup = async () => {
    setIsApplying(true);

    // Apply all selections
    for (const quest of QUESTS) {
      const state = questStates[quest.id];
      if (state === 'done') {
        bulkCompleteQuest(quest.id);
      } else if (state === 'partial') {
        const tasks = selectedTasks[quest.id];
        if (tasks) {
          for (const taskId of tasks) {
            completeTask(quest.id, taskId, undefined, {
              completedDate: new Date().toISOString().split('T')[0],
            });
          }
        }
      }
    }

    // Small delay for visual feedback
    await new Promise(r => setTimeout(r, 800));
    router.replace('/roadmap');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {/* Step 1: Names */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              반갑습니다!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              두 분의 이름을 알려주세요
            </p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="나의 이름"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
              <div className="text-pink-400 font-bold text-lg">&</div>
              <input
                type="text"
                placeholder="상대방 이름"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleStep1}
              disabled={!userName.trim() || !partnerName.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Wedding Date */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              결혼식 날짜가 정해졌나요?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              날짜를 알려주시면 일정에 맞춰 안내해드릴게요
            </p>

            <div className="mb-6">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-center text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleStep2}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 3: Already in progress? */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              이미 준비 중이신가요?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              이미 진행한 항목을 빠르게 체크하면<br />
              남은 것만 집중할 수 있어요
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartQuickSetup}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                네, 이미 준비 중이에요
              </button>
              <button
                onClick={handleStartFresh}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                처음 시작해요
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Quick Setup */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                어디까지 했는지 알려주세요
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                빠르게 체크하고 남은 것만 집중하세요
              </p>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {QUESTS.map(quest => {
                const Icon = getQuestIcon(quest.icon);
                const state = questStates[quest.id];
                const isExpanded = expandedQuestId === quest.id && state === 'partial';
                const checkedCount = selectedTasks[quest.id]?.size || 0;

                return (
                  <div key={quest.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center gap-3 p-3">
                      {/* Quest icon */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: quest.color + '20' }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: quest.color }} />
                      </div>

                      {/* Quest title + task count */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {quest.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {quest.tasks.length}개 항목
                          {state === 'partial' && checkedCount > 0 && (
                            <span className="text-blue-500 ml-1">({checkedCount}개 선택)</span>
                          )}
                        </p>
                      </div>

                      {/* 3-state toggle */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleQuestState(quest.id, 'none')}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                            state === 'none'
                              ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => toggleQuestState(quest.id, 'partial')}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                            state === 'partial'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          진행 중
                        </button>
                        <button
                          onClick={() => toggleQuestState(quest.id, 'done')}
                          className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                            state === 'done'
                              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 ring-1 ring-green-300 dark:ring-green-700'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          완료
                        </button>
                      </div>
                    </div>

                    {/* Expanded task list for "partial" */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
                            {/* Select all toggle */}
                            <button
                              onClick={() => {
                                const allIds = quest.tasks.map(t => t.id);
                                const current = selectedTasks[quest.id] || new Set();
                                const allSelected = allIds.every(id => current.has(id));
                                setSelectedTasks(prev => ({
                                  ...prev,
                                  [quest.id]: allSelected ? new Set() : new Set(allIds),
                                }));
                              }}
                              className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mb-1 hover:underline"
                            >
                              {(selectedTasks[quest.id]?.size || 0) === quest.tasks.length ? '전체 해제' : '전체 선택'}
                            </button>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {quest.tasks.map(task => {
                                const isChecked = selectedTasks[quest.id]?.has(task.id) || false;
                                return (
                                  <label
                                    key={task.id}
                                    className="flex items-center gap-2 py-1 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleTask(quest.id, task.id)}
                                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`text-xs ${isChecked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {task.title}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 space-y-2">
              {setupSummary > 0 && (
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{setupSummary}개</span> 태스크를 완료 처리합니다
                </p>
              )}
              <button
                onClick={handleApplySetup}
                disabled={isApplying}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isApplying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    적용 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    설정 완료
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                뒤로 가기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
