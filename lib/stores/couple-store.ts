import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CoupleStore } from '@/lib/types'

/**
 * 커플 정보 관리 스토어
 * 현재 로그인한 사용자의 커플 정보를 관리합니다.
 */
export const useCoupleStore = create<CoupleStore>()(
  devtools(
    (set) => ({
      couple: null,
      isLoading: false,

      setCouple: (couple) => set({ couple }),

      updateCouple: (updates) =>
        set((state) => ({
          couple: state.couple ? { ...state.couple, ...updates } : null,
        })),
    }),
    { name: 'CoupleStore' }
  )
)
