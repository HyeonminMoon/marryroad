import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProgressStore } from '@/lib/types'

/**
 * 진행상황 관리 스토어
 * 모든 스테이지의 진행상황과 요약 정보를 관리합니다.
 */
export const useProgressStore = create<ProgressStore>()(
  devtools(
    (set) => ({
      progress: [],
      summary: null,
      isLoading: false,

      setProgress: (progress) => set({ progress }),

      setSummary: (summary) => set({ summary }),

      updateStageProgress: (stageId, updates) =>
        set((state) => ({
          progress: state.progress.map((p) =>
            p.stage_id === stageId ? { ...p, ...updates } : p
          ),
        })),
    }),
    { name: 'ProgressStore' }
  )
)
