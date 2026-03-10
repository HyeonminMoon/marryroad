/**
 * Quest-Task Type Definitions
 * Quest: High-level category (19 total)
 * Task: Detailed checklist item (137 total)
 */

export interface ChecklistItem {
  text: string;
  isOptional: boolean;
  tips?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: '상' | '중' | '하';
  recommendedTiming: string;
  estimatedDuration: string;
  checklist: ChecklistItem[];
  isOptional: boolean;
  tags: string[];
  typicalCostMin: number | null;
  typicalCostMax: number | null;
  // Task 간 종속성 (같은 Quest 내 또는 다른 Quest의 Task ID)
  taskDependencies?: string[];
  // 종속성 경고 메시지 (이 Task 시작 전 확인해야 할 사항)
  prerequisiteNote?: string;
}

export interface Quest {
  id: string;
  title: string;
  icon: string;
  color: string;
  xp: number;
  dependencies: string[]; // Quest IDs that must be completed first
  tasks: Task[];

  // Computed
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number; // 0-100 percentage
  position?: { x: number; y: number }; // For React Flow canvas

  // React Flow requires Record<string, unknown> compatibility
  [key: string]: unknown;
}

export interface TaskExtendedData {
  memo?: string;
  completedDate?: string; // ISO 8601 format (YYYY-MM-DD)
  vendorInfo?: {
    name: string;
    contact?: string;
    website?: string;
    address?: string;
  };
  rating?: number; // 1-5 stars
  photos?: string[]; // URLs or base64 strings
}

export interface QuestProgress {
  completedQuestIds: string[];
  taskProgress: Record<string, {
    completedTaskIds: string[];
    taskCosts: Record<string, number>; // task ID -> user's actual cost
    taskExtendedData: Record<string, TaskExtendedData>; // task ID -> extended data
  }>;
  xp: number;
  level: number;
  budget: {
    total: number;
    spent: number;
  };
  weddingDate: string | null; // ISO date string, e.g. "2026-11-15"
  activeDates: string[]; // Dates when user completed at least 1 task, e.g. ["2026-03-05"]
  activityCounts: Record<string, number>; // Date -> task count for heatmap intensity
  coupleNames: { user: string; partner: string } | null;
  decisionSelections: Record<string, string>; // "{taskId}-{checklistIdx}" -> selected option text
  weeklyChallenge: {
    weekStart: string; // ISO date of Monday
    claimedRewards: string[]; // challenge IDs that have been claimed
    completedWeeks: string[]; // weekStart dates where all 4 challenges were cleared
  };
  hiddenQuestIds: string[]; // Quests the user chose to hide/skip
}

export type QuestStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface JourneyEvent {
  type: 'task' | 'quest-complete' | 'level-up';
  date: string; // YYYY-MM-DD
  questId: string;
  questTitle: string;
  questColor: string;
  questIcon: string;
  taskId?: string;
  taskTitle?: string;
  memo?: string;
  photos?: string[];
  cost?: number;
  vendorName?: string;
  rating?: number;
  xpEarned?: number;
  newLevel?: number;
}
