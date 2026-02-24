import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { NotificationStore } from '@/lib/types'

/**
 * 알림 관리 스토어
 * 사용자의 알림 목록과 읽지 않은 알림 개수를 관리합니다.
 */
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),

      markAsRead: (notificationId) =>
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
          )
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          }
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
            read_at: new Date().toISOString(),
          })),
          unreadCount: 0,
        })),
    }),
    { name: 'NotificationStore' }
  )
)
