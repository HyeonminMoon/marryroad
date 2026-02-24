export * from './auth';
export * from './quest';
export * from './marryroad';

// Temporary type definitions to fix build errors
export interface Couple {
  id: string;
  partner1Id: string;
  partner2Id?: string;
  weddingDate?: string;
  budget?: number;
  [key: string]: any;
}

export interface CoupleStore {
  couple: Couple | null;
  isLoading: boolean;
  setCouple: (couple: Couple | null) => void;
  updateCouple: (updates: Partial<Couple>) => void;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Progress {
  stage_id: string;
  [key: string]: any;
}

export interface ProgressSummary {
  [key: string]: any;
}

export interface ProgressStore {
  progress: Progress[];
  summary: ProgressSummary | null;
  isLoading: boolean;
  setProgress: (progress: Progress[]) => void;
  setSummary: (summary: ProgressSummary | null) => void;
  updateStageProgress: (stageId: string, updates: Partial<Progress>) => void;
}
