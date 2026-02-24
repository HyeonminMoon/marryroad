import { ChecklistItem } from './quest';

export interface Stage {
  id: string;
  categoryId: string;
  category: string;
  subcategoryId: string;
  subcategory: string;
  title: string;
  description: string;
  priority: string;
  timing: string;
  duration: string;
  costMin: number | null;
  costMax: number | null;
  order: number;
  icon: string;
  color: string;
  checklist: ChecklistItem[];
  isOptional: boolean;
  tags: string[];
}

export interface Dependency {
  source: string; // The prerequisite stage ID
  target: string; // The dependent stage ID
  type: 'required' | 'optional';
}

export type NodeStatus = 'locked' | 'available' | 'completed' | 'skipped';

export interface GameNode extends Stage {
  // Graph properties
  position: { x: number; y: number };
  status: NodeStatus;
  
  // Computed properties
  isUnlockable: boolean; // Dependencies met but not completed
  depth: number; // For layout (Tier)
}

export interface GameEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface UserProgress {
  completedStageIds: string[];
  skippedStageIds: string[];
  xp: number;
  level: number;
  budget: {
    total: number;
    spent: number;
  };
}
