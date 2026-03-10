import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, QuestProgress, QuestStatus, Task, TaskExtendedData } from '../types/quest';
import questsData from '../data/quests.json';
import { DEFAULT_BUDGET } from '../constants';
import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

const QUESTS = questsData as Quest[];

/** Task 1개 완료 시 부여하는 기본 XP */
const TASK_XP = 10;

/**
 * 레벨업에 필요한 누적 XP를 계산
 * 레벨 1->2: 500, 2->3: 600, 3->4: 700, ...
 * 즉 레벨 N에 도달하려면 sum(500 + 100*(i-1), i=1..N-1) 만큼의 누적 XP가 필요
 */
function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 500; // 레벨 1->2 에 필요한 XP
  let cumulativeXp = 0;

  while (cumulativeXp + xpNeeded <= totalXp) {
    cumulativeXp += xpNeeded;
    level++;
    xpNeeded = 500 + (level - 1) * 100; // 다음 레벨업에 필요한 추가 XP
  }

  return level;
}

/**
 * XP 바 표시를 위한 레벨 진행률 계산
 * @returns { currentLevelXp: 현재 레벨에서 모은 XP, nextLevelXp: 다음 레벨까지 필요한 XP, percent: 0-100 }
 */
export function calculateLevelProgress(totalXp: number): {
  currentLevelXp: number;
  nextLevelXp: number;
  percent: number;
} {
  let level = 1;
  let xpNeeded = 500;
  let cumulativeXp = 0;

  while (cumulativeXp + xpNeeded <= totalXp) {
    cumulativeXp += xpNeeded;
    level++;
    xpNeeded = 500 + (level - 1) * 100;
  }

  const currentLevelXp = totalXp - cumulativeXp;
  return {
    currentLevelXp,
    nextLevelXp: xpNeeded,
    percent: Math.round((currentLevelXp / xpNeeded) * 100),
  };
}

interface QuestStore {
  // Data
  quests: Quest[];
  
  // Progress
  progress: QuestProgress;
  
  // Actions
  initialize: () => void;
  completeTask: (questId: string, taskId: string, cost?: number, extendedData?: TaskExtendedData) => void;
  updateTaskMemo: (questId: string, taskId: string, memo: string) => void;
  completeQuest: (questId: string) => void;
  bulkCompleteQuest: (questId: string) => void;
  resetProgress: () => void;
  setBudgetTotal: (total: number) => void;
  setWeddingDate: (date: string | null) => void;
  grantAchievementXp: (xp: number) => void;
  setCoupleNames: (user: string, partner: string) => void;
  setDecisionSelection: (taskId: string, checklistIdx: number, option: string | null) => void;
  getDecisionSelection: (taskId: string, checklistIdx: number) => string | undefined;
  claimWeeklyReward: (challengeId: string, weekStart: string) => void;
  toggleHideQuest: (questId: string) => void;
  uncompleteTask: (questId: string, taskId: string) => void;
  setCategoryBudget: (questId: string, amount: number) => void;

  // Quest Logic
  getQuestStatus: (questId: string) => QuestStatus;
  getQuestProgress: (questId: string) => number;
  
  // React Flow Adapter
  getFlowNodes: () => Node[];
  getFlowEdges: () => Edge[];
}

/**
 * Calculate if a quest is unlocked based on dependencies
 * Now supports 'in-progress' status when some tasks are completed
 */
function calculateQuestStatus(
  questId: string,
  completedQuestIds: string[],
  quests: Quest[],
  taskProgress?: QuestProgress['taskProgress']
): QuestStatus {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return 'locked';

  // Check if all dependencies are completed
  const allDependenciesCompleted = quest.dependencies.every(depId =>
    completedQuestIds.includes(depId)
  );

  if (!allDependenciesCompleted) return 'locked';

  if (completedQuestIds.includes(questId)) return 'completed';

  // Check if any task has been completed -> in-progress
  if (taskProgress) {
    const questTaskProgress = taskProgress[questId];
    if (questTaskProgress && questTaskProgress.completedTaskIds.length > 0) {
      return 'in-progress';
    }
  }

  return 'available';
}

/**
 * Edge 색상을 source Quest ID 기준으로 Phase별로 결정
 * @param sourceId - 의존성의 source Quest ID
 * @returns CSS 색상 코드
 */
function getEdgeColor(sourceId: string): string {
  const source = parseInt(sourceId, 10);

  if (source <= 2) return '#6366F1';   // 기획 단계
  if (source <= 6) return '#8B5CF6';   // 핵심 계약
  if (source === 7) return '#EC4899';  // 초대 준비
  if (source <= 10) return '#10B981';  // 생활 준비
  return '#F59E0B';                     // 본식 이후
}

/**
 * Calculate quest progress percentage (0-100)
 */
function calculateQuestProgressPercent(
  questId: string,
  taskProgress: QuestProgress['taskProgress']
): number {
  const quest = QUESTS.find(q => q.id === questId);
  if (!quest || quest.tasks.length === 0) return 0;
  
  const completedCount = taskProgress[questId]?.completedTaskIds?.length || 0;
  return Math.round((completedCount / quest.tasks.length) * 100);
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],
      progress: {
        completedQuestIds: [],
        taskProgress: {},
        xp: 0,
        level: 1,
        budget: {
          total: DEFAULT_BUDGET,
          spent: 0,
        },
        weddingDate: null,
        activeDates: [],
        activityCounts: {},
        coupleNames: null,
        decisionSelections: {},
        weeklyChallenge: { weekStart: '', claimedRewards: [], completedWeeks: [] },
        hiddenQuestIds: [],
        categoryBudgets: {},
      },

      initialize: () => {
        const { progress } = get();
        
        // Define clear phases with manual ranks for visual hierarchy
        const questPhases: Record<string, number> = {
          '1': 0,   // Phase 0: 기획
          '2': 1,   // Phase 1: 상견례
          '3': 2,   // Phase 2: 웨딩홀
          '12': 2,  // Phase 2: 허니문 (병렬 가능)
          '4': 3,   // Phase 3: 스드메
          '6': 3,   // Phase 3: 예물 (병렬 가능)
          '5': 4,   // Phase 4: 신랑 준비
          '7': 4,   // Phase 4: 청첩장 (병렬 가능)
          '8': 4,   // Phase 4: 신혼집 (병렬 가능)
          '9': 5,   // Phase 5: 인테리어
          '10': 6,  // Phase 6: 혼수/가구
          '11': 7,  // Phase 7: 본식 준비
          '13': 8,  // Phase 8: 이사
          '14': 9,  // Phase 9: 행정
        };
        
        // Use Dagre for auto-layout with manual ranking
        const g = new dagre.graphlib.Graph();
        g.setGraph({ 
          rankdir: 'TB',      // Top to Bottom
          ranksep: 200,       // 레벨 간 간격
          nodesep: 180,       // 노드 간 간격
          edgesep: 50,        // Edge 간 간격
          marginx: 80,        // 여백
          marginy: 80,
          ranker: 'longest-path',  // 가장 긴 경로 기준 정렬
        });
        g.setDefaultEdgeLabel(() => ({}));

        // Add nodes to dagre with manual ranks
        QUESTS.forEach(quest => {
          const rank = questPhases[quest.id] || 0;
          g.setNode(quest.id, { 
            width: 280, 
            height: 180,
            rank: rank  // Manual rank assignment
          });
        });

        // Add edges to dagre
        QUESTS.forEach(quest => {
          quest.dependencies.forEach(depId => {
            g.setEdge(depId, quest.id);
          });
        });

        // Calculate layout
        dagre.layout(g);

        // Map Quests with Dagre positions and calculated status
        const initialQuests: Quest[] = QUESTS.map(quest => {
          const status = calculateQuestStatus(quest.id, progress.completedQuestIds, QUESTS, progress.taskProgress);
          const progressPercent = calculateQuestProgressPercent(quest.id, progress.taskProgress);
          
          const nodeWithPos = g.node(quest.id);
          
          return {
            ...quest,
            position: { 
              x: nodeWithPos.x - 140,
              y: nodeWithPos.y - 90 
            },
            status,
            progress: progressPercent,
          };
        });

        set({ quests: initialQuests });
      },

      completeTask: (questId: string, taskId: string, cost?: number, extendedData?: TaskExtendedData) => {
        set(state => {
          // Deep-copy progress to ensure immutability
          const prevQuestProgress = state.progress.taskProgress[questId];
          const existingExtData = prevQuestProgress?.taskExtendedData ?? {};

          const currentQuestProgress = prevQuestProgress
            ? {
                completedTaskIds: [...prevQuestProgress.completedTaskIds],
                taskCosts: { ...prevQuestProgress.taskCosts },
                taskExtendedData: { ...existingExtData },
              }
            : {
                completedTaskIds: [] as string[],
                taskCosts: {} as Record<string, number>,
                taskExtendedData: {} as Record<string, TaskExtendedData>,
              };

          const isAlreadyCompleted = currentQuestProgress.completedTaskIds.includes(taskId);
          let xpDelta = 0;

          // Add task to completed list (prevent duplicates)
          if (!isAlreadyCompleted) {
            currentQuestProgress.completedTaskIds = [
              ...currentQuestProgress.completedTaskIds,
              taskId,
            ];
            xpDelta += TASK_XP;
          }

          // Record cost if provided, with proper spent recalculation
          let spentDelta = 0;
          if (cost !== undefined) {
            const previousCost = currentQuestProgress.taskCosts[taskId] || 0;
            currentQuestProgress.taskCosts = {
              ...currentQuestProgress.taskCosts,
              [taskId]: cost,
            };
            spentDelta = cost - previousCost;
          }

          // Store extended data (memo, date, vendor, rating, photos)
          if (extendedData) {
            currentQuestProgress.taskExtendedData = {
              ...currentQuestProgress.taskExtendedData,
              [taskId]: {
                ...(currentQuestProgress.taskExtendedData[taskId] ?? {}),
                ...extendedData,
              },
            };
          }

          // Build new taskProgress immutably
          const newTaskProgress = {
            ...state.progress.taskProgress,
            [questId]: currentQuestProgress,
          };

          // Check if quest is fully completed
          let newCompletedQuestIds = [...state.progress.completedQuestIds];
          const quest = QUESTS.find(q => q.id === questId);
          if (quest) {
            const allTasksCompleted = quest.tasks.every(task =>
              currentQuestProgress.completedTaskIds.includes(task.id)
            );

            if (allTasksCompleted && !newCompletedQuestIds.includes(questId)) {
              newCompletedQuestIds = [...newCompletedQuestIds, questId];
              xpDelta += quest.xp; // Quest completion bonus XP
            }
          }

          const newXp = state.progress.xp + xpDelta;

          // Track active date for streak (trim to last 90 days)
          const today = new Date().toISOString().split('T')[0];
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 90);
          const cutoffStr = cutoff.toISOString().split('T')[0];
          const trimmedDates = state.progress.activeDates.filter(d => d >= cutoffStr);
          const newActiveDates = trimmedDates.includes(today)
            ? trimmedDates
            : [...trimmedDates, today];

          // Track activity count per day for heatmap intensity
          const prevCounts = state.progress.activityCounts || {};
          const newActivityCounts = !isAlreadyCompleted
            ? { ...prevCounts, [today]: (prevCounts[today] || 0) + 1 }
            : prevCounts;

          const newProgress: QuestProgress = {
            completedQuestIds: newCompletedQuestIds,
            taskProgress: newTaskProgress,
            xp: newXp,
            level: calculateLevel(newXp),
            budget: {
              total: state.progress.budget.total,
              spent: state.progress.budget.spent + spentDelta,
            },
            weddingDate: state.progress.weddingDate,
            activeDates: newActiveDates,
            activityCounts: newActivityCounts,
            coupleNames: state.progress.coupleNames,
            decisionSelections: state.progress.decisionSelections,
            weeklyChallenge: state.progress.weeklyChallenge,
            hiddenQuestIds: state.progress.hiddenQuestIds || [],
            categoryBudgets: state.progress.categoryBudgets || {},
          };

          // Recalculate quest statuses
          const updatedQuests = state.quests.map(q => ({
            ...q,
            status: calculateQuestStatus(q.id, newCompletedQuestIds, QUESTS, newTaskProgress),
            progress: calculateQuestProgressPercent(q.id, newTaskProgress),
          }));

          return {
            progress: newProgress,
            quests: updatedQuests,
          };
        });
      },

      updateTaskMemo: (questId: string, taskId: string, memo: string) => {
        set(state => {
          const prevQuestProgress = state.progress.taskProgress[questId];
          if (!prevQuestProgress) return state;

          const existingExtData = prevQuestProgress.taskExtendedData ?? {};
          const taskExtData = existingExtData[taskId] ?? {};

          return {
            progress: {
              ...state.progress,
              taskProgress: {
                ...state.progress.taskProgress,
                [questId]: {
                  ...prevQuestProgress,
                  taskExtendedData: {
                    ...existingExtData,
                    [taskId]: {
                      ...taskExtData,
                      memo,
                    },
                  },
                },
              },
            },
          };
        });
      },

      completeQuest: (questId: string) => {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        // Complete all tasks in quest
        quest.tasks.forEach(task => {
          get().completeTask(questId, task.id);
        });
      },

      bulkCompleteQuest: (questId: string) => {
        set(state => {
          const quest = QUESTS.find(q => q.id === questId);
          if (!quest) return state;

          const today = new Date().toISOString().split('T')[0];
          const prevQP = state.progress.taskProgress[questId];
          const existingCompleted = prevQP?.completedTaskIds || [];

          // Find tasks not yet completed
          const newTaskIds = quest.tasks
            .map(t => t.id)
            .filter(id => !existingCompleted.includes(id));

          if (newTaskIds.length === 0) return state;

          const allTaskIds = [...existingCompleted, ...newTaskIds];
          const xpDelta = (newTaskIds.length * TASK_XP) +
            (!state.progress.completedQuestIds.includes(questId) ? quest.xp : 0);

          // Build extended data with completedDate for new tasks
          const existingExt = prevQP?.taskExtendedData ?? {};
          const newExtData = { ...existingExt };
          for (const taskId of newTaskIds) {
            newExtData[taskId] = {
              ...(newExtData[taskId] ?? {}),
              completedDate: today,
            };
          }

          const newXp = state.progress.xp + xpDelta;

          // Activity tracking
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 90);
          const cutoffStr = cutoff.toISOString().split('T')[0];
          const trimmedDates = state.progress.activeDates.filter(d => d >= cutoffStr);
          const newActiveDates = trimmedDates.includes(today) ? trimmedDates : [...trimmedDates, today];
          const prevCounts = state.progress.activityCounts || {};
          const newActivityCounts = { ...prevCounts, [today]: (prevCounts[today] || 0) + newTaskIds.length };

          return {
            progress: {
              ...state.progress,
              completedQuestIds: state.progress.completedQuestIds.includes(questId)
                ? state.progress.completedQuestIds
                : [...state.progress.completedQuestIds, questId],
              taskProgress: {
                ...state.progress.taskProgress,
                [questId]: {
                  completedTaskIds: allTaskIds,
                  taskCosts: prevQP?.taskCosts ?? {},
                  taskExtendedData: newExtData,
                },
              },
              xp: newXp,
              level: calculateLevel(newXp),
              activeDates: newActiveDates,
              activityCounts: newActivityCounts,
            },
          };
        });
      },

      resetProgress: () => {
        const currentBudgetTotal = get().progress.budget.total;
        const currentWeddingDate = get().progress.weddingDate;
        set({
          progress: {
            completedQuestIds: [],
            taskProgress: {},
            xp: 0,
            level: 1,
            budget: {
              total: currentBudgetTotal,
              spent: 0,
            },
            weddingDate: currentWeddingDate,
            activeDates: [],
            activityCounts: {},
            coupleNames: get().progress.coupleNames, // Preserve couple names
            decisionSelections: {},
            weeklyChallenge: { weekStart: '', claimedRewards: [], completedWeeks: [] },
            hiddenQuestIds: [],
            categoryBudgets: {},
          },
        });

        // Re-initialize to reset statuses
        get().initialize();
      },

      setBudgetTotal: (total: number) => {
        set(state => ({
          progress: {
            ...state.progress,
            budget: {
              ...state.progress.budget,
              total,
            },
          },
        }));
      },

      setWeddingDate: (date: string | null) => {
        set(state => ({
          progress: {
            ...state.progress,
            weddingDate: date,
          },
        }));
      },

      grantAchievementXp: (xp: number) => {
        set(state => {
          const newXp = state.progress.xp + xp;
          return {
            progress: {
              ...state.progress,
              xp: newXp,
              level: calculateLevel(newXp),
            },
          };
        });
      },

      setCoupleNames: (user: string, partner: string) => {
        set(state => ({
          progress: {
            ...state.progress,
            coupleNames: { user, partner },
          },
        }));
      },

      setDecisionSelection: (taskId: string, checklistIdx: number, option: string | null) => {
        set(state => {
          const key = `${taskId}-${checklistIdx}`;
          const newSelections = { ...state.progress.decisionSelections };
          if (option === null) {
            delete newSelections[key];
          } else {
            newSelections[key] = option;
          }
          return {
            progress: {
              ...state.progress,
              decisionSelections: newSelections,
            },
          };
        });
      },

      getDecisionSelection: (taskId: string, checklistIdx: number) => {
        const key = `${taskId}-${checklistIdx}`;
        return get().progress.decisionSelections[key];
      },

      claimWeeklyReward: (challengeId: string, weekStart: string) => {
        const CHALLENGE_XP = 25;
        const TOTAL_CHALLENGES = 4;
        set(state => {
          const wc = state.progress.weeklyChallenge;
          // Reset if different week
          const claimed = wc.weekStart === weekStart
            ? [...wc.claimedRewards]
            : [];
          if (claimed.includes(challengeId)) return state;
          claimed.push(challengeId);
          const newXp = state.progress.xp + CHALLENGE_XP;

          // Track completed weeks (all challenges cleared)
          const completedWeeks = [...(wc.completedWeeks || [])];
          if (claimed.length >= TOTAL_CHALLENGES && !completedWeeks.includes(weekStart)) {
            completedWeeks.push(weekStart);
          }

          return {
            progress: {
              ...state.progress,
              xp: newXp,
              level: calculateLevel(newXp),
              weeklyChallenge: { weekStart, claimedRewards: claimed, completedWeeks },
            },
          };
        });
      },

      toggleHideQuest: (questId: string) => {
        set(state => {
          const hidden = state.progress.hiddenQuestIds || [];
          const next = hidden.includes(questId)
            ? hidden.filter(id => id !== questId)
            : [...hidden, questId];
          return {
            progress: { ...state.progress, hiddenQuestIds: next },
          };
        });
      },

      uncompleteTask: (questId: string, taskId: string) => {
        set(state => {
          const tp = state.progress.taskProgress[questId];
          if (!tp || !tp.completedTaskIds.includes(taskId)) return state;

          const newCompletedIds = tp.completedTaskIds.filter(id => id !== taskId);
          const taskCost = tp.taskCosts[taskId] || 0;
          const newTaskCosts = { ...tp.taskCosts };
          delete newTaskCosts[taskId];
          const newExtData = { ...(tp.taskExtendedData || {}) };
          delete newExtData[taskId];

          return {
            progress: {
              ...state.progress,
              taskProgress: {
                ...state.progress.taskProgress,
                [questId]: {
                  ...tp,
                  completedTaskIds: newCompletedIds,
                  taskCosts: newTaskCosts,
                  taskExtendedData: newExtData,
                },
              },
              completedQuestIds: state.progress.completedQuestIds.filter(id => id !== questId),
              budget: {
                ...state.progress.budget,
                spent: Math.max(0, state.progress.budget.spent - taskCost),
              },
            },
          };
        });
      },

      setCategoryBudget: (questId: string, amount: number) => {
        set(state => ({
          progress: {
            ...state.progress,
            categoryBudgets: {
              ...state.progress.categoryBudgets,
              [questId]: amount,
            },
          },
        }));
      },

      getQuestStatus: (questId: string) => {
        const { progress } = get();
        return calculateQuestStatus(questId, progress.completedQuestIds, QUESTS, progress.taskProgress);
      },

      getQuestProgress: (questId: string) => {
        const { progress } = get();
        return calculateQuestProgressPercent(questId, progress.taskProgress);
      },

      getFlowNodes: () => {
        const { quests } = get();
        return quests.map(quest => ({
          id: quest.id,
          type: 'questNode',
          position: quest.position!,
          data: quest,
        }));
      },

      getFlowEdges: () => {
        const edges: Edge[] = [];
        const questMap = new Map(QUESTS.map(q => [q.id, q]));

        QUESTS.forEach(quest => {
          quest.dependencies.forEach((depId) => {
            const sourceQuest = questMap.get(depId);
            if (!sourceQuest) return;

            const edgeColor = getEdgeColor(depId);
            
            edges.push({
              id: `${depId}-${quest.id}`,
              source: depId,
              target: quest.id,
              type: 'smoothstep',
              animated: false,
              label: sourceQuest.title.split(' ')[0], // 첫 단어만 표시
              labelStyle: { 
                fontSize: 10, 
                fontWeight: 600,
                fill: edgeColor,
              },
              labelBgStyle: {
                fill: 'white',
                fillOpacity: 0.8,
              },
              style: { 
                stroke: edgeColor, 
                strokeWidth: 2,
                opacity: 0.8,
              },
              markerEnd: {
                type: 'arrowclosed',
                color: edgeColor,
                width: 20,
                height: 20,
              },
            });
          });
        });
        return edges;
      },
    }),
    {
      name: 'marryroad-quest-storage',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
