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
  
  // User progress - 확장된 기록 시스템
  completed?: boolean;
  userCost?: number;
  userMemo?: string;
  completedDate?: string; // ISO 8601 format
  vendorInfo?: {
    name: string;
    contact?: string;
    website?: string;
    address?: string;
  };
  rating?: number; // 1-5 stars
  photos?: string[]; // URLs or base64 strings
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
  [key: string]: unknown;
}

export interface QuestProgress {
  completedQuestIds: string[];
  taskProgress: Record<string, {
    completedTaskIds: string[];
    taskCosts: Record<string, number>; // task ID -> user's actual cost
  }>;
  xp: number;
  level: number;
  budget: {
    total: number;
    spent: number;
  };
}

export type QuestStatus = 'locked' | 'available' | 'in-progress' | 'completed';
