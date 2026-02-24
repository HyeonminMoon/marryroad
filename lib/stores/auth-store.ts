import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AuthStore } from '@/lib/types/auth'

/**
 * 인증 상태 관리 스토어
 * 사용자 정보와 세션을 관리합니다.
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        session: null,
        isLoading: false,

        setUser: (user) => set({ user }),

        setSession: (session) => set({ session, user: session?.user || null }),

        signOut: () =>
          set({
            user: null,
            session: null,
          }),
      }),
      {
        name: 'marryroad-auth',
        // 민감한 정보는 persist하지 않도록 필터링
        partialize: (state) => ({
          user: state.user,
          // session은 제외 (토큰 정보 포함)
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)
