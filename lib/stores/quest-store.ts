import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quest, QuestProgress, QuestStatus, Task } from '../types/quest';
import questsData from '../data/quests.json';
import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

const QUESTS = questsData as Quest[];

interface QuestStore {
  // Data
  quests: Quest[];
  
  // Progress
  progress: QuestProgress;
  
  // Actions
  initialize: () => void;
  completeTask: (questId: string, taskId: string, cost?: number) => void;
  completeQuest: (questId: string) => void;
  resetProgress: () => void;
  
  // Quest Logic
  getQuestStatus: (questId: string) => QuestStatus;
  getQuestProgress: (questId: string) => number;
  
  // React Flow Adapter
  getFlowNodes: () => Node[];
  getFlowEdges: () => Edge[];
}

/**
 * Calculate if a quest is unlocked based on dependencies
 */
function calculateQuestStatus(
  questId: string, 
  completedQuestIds: string[], 
  quests: Quest[]
): QuestStatus {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return 'locked';
  
  // Check if all dependencies are completed
  const allDependenciesCompleted = quest.dependencies.every(depId => 
    completedQuestIds.includes(depId)
  );
  
  if (!allDependenciesCompleted) return 'locked';
  
  if (completedQuestIds.includes(questId)) return 'completed';
  
  return 'available';
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
          total: 30000000,
          spent: 0,
        },
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
          const status = calculateQuestStatus(quest.id, progress.completedQuestIds, QUESTS);
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

      completeTask: (questId: string, taskId: string, cost?: number) => {
        set(state => {
          const newProgress = { ...state.progress };
          
          // Initialize quest progress if needed
          if (!newProgress.taskProgress[questId]) {
            newProgress.taskProgress[questId] = {
              completedTaskIds: [],
              taskCosts: {},
            };
          }
          
          // Add task to completed list
          if (!newProgress.taskProgress[questId].completedTaskIds.includes(taskId)) {
            newProgress.taskProgress[questId].completedTaskIds.push(taskId);
          }
          
          // Record cost if provided
          if (cost !== undefined) {
            newProgress.taskProgress[questId].taskCosts[taskId] = cost;
            newProgress.budget.spent += cost;
          }
          
          // Check if quest is fully completed
          const quest = QUESTS.find(q => q.id === questId);
          if (quest) {
            const allTasksCompleted = quest.tasks.every(task => 
              newProgress.taskProgress[questId].completedTaskIds.includes(task.id)
            );
            
            if (allTasksCompleted && !newProgress.completedQuestIds.includes(questId)) {
              newProgress.completedQuestIds.push(questId);
              newProgress.xp += quest.xp;
              
              // Level up logic
              const newLevel = Math.floor(newProgress.xp / 500) + 1;
              newProgress.level = newLevel;
            }
          }
          
          // Recalculate quest statuses
          const updatedQuests = state.quests.map(q => ({
            ...q,
            status: calculateQuestStatus(q.id, newProgress.completedQuestIds, QUESTS),
            progress: calculateQuestProgressPercent(q.id, newProgress.taskProgress),
          }));
          
          return {
            progress: newProgress,
            quests: updatedQuests,
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

      resetProgress: () => {
        set({
          progress: {
            completedQuestIds: [],
            taskProgress: {},
            xp: 0,
            level: 1,
            budget: {
              total: 30000000,
              spent: 0,
            },
          },
        });
        
        // Re-initialize to reset statuses
        get().initialize();
      },

      getQuestStatus: (questId: string) => {
        const { progress } = get();
        return calculateQuestStatus(questId, progress.completedQuestIds, QUESTS);
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
          quest.dependencies.forEach((depId, index) => {
            const sourceQuest = questMap.get(depId);
            if (!sourceQuest) return;
            
            // Phase별 색상 구분
            const getEdgeColor = (sourceId: string, targetId: string) => {
              const source = parseInt(sourceId);
              const target = parseInt(targetId);
              
              // 기획 단계
              if (source <= 2) return '#6366F1';
              // 핵심 계약
              if (source <= 6) return '#8B5CF6';
              // 초대 준비
              if (source === 7) return '#EC4899';
              // 생활 준비
              if (source <= 10) return '#10B981';
              // 본식 이후
              return '#F59E0B';
            };
            
            const edgeColor = getEdgeColor(depId, quest.id);
            
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
