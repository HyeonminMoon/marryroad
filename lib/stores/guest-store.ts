import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Guest, GuestStats, RsvpStatus, GuestSide, GuestRelation, MealType } from '@/lib/types/guest';

interface GuestStore {
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  clearAll: () => void;
  getStats: () => GuestStats;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      guests: [],

      addGuest: (data) => {
        const guest: Guest = {
          ...data,
          id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ guests: [...state.guests, guest] }));
      },

      updateGuest: (id, data) => {
        set(state => ({
          guests: state.guests.map(g => g.id === id ? { ...g, ...data } : g),
        }));
      },

      removeGuest: (id) => {
        set(state => ({
          guests: state.guests.filter(g => g.id !== id),
        }));
      },

      clearAll: () => {
        set({ guests: [] });
      },

      getStats: () => {
        const { guests } = get();
        const stats: GuestStats = {
          total: guests.length,
          confirmed: guests.filter(g => g.rsvp === 'confirmed').length,
          declined: guests.filter(g => g.rsvp === 'declined').length,
          pending: guests.filter(g => g.rsvp === 'pending').length,
          groomSide: guests.filter(g => g.side === 'groom').length,
          brideSide: guests.filter(g => g.side === 'bride').length,
          sharedSide: guests.filter(g => g.side === 'shared').length,
          totalGiftAmount: guests.reduce((sum, g) => sum + (g.giftAmount || 0), 0),
          mealCounts: {
            standard: guests.filter(g => g.meal === 'standard' && g.rsvp === 'confirmed').length,
            vegetarian: guests.filter(g => g.meal === 'vegetarian' && g.rsvp === 'confirmed').length,
            none: guests.filter(g => g.meal === 'none' && g.rsvp === 'confirmed').length,
          },
        };
        // Count +1 guests — add to same rsvp/side category as their host
        guests.forEach(g => {
          if (!g.plusOne) return;
          stats.total++;
          if (g.rsvp === 'confirmed') {
            stats.confirmed++;
            // plusOne defaults to standard meal (no separate meal selection UI)
            stats.mealCounts.standard++;
          } else if (g.rsvp === 'declined') {
            stats.declined++;
          } else {
            stats.pending++;
          }
          if (g.side === 'groom') stats.groomSide++;
          else if (g.side === 'bride') stats.brideSide++;
          else if (g.side === 'shared') stats.sharedSide++;
        });
        return stats;
      },
    }),
    {
      name: 'marryroad-guests',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => localStorage.getItem(name),
        setItem: (name: string, value: string) => {
          try {
            localStorage.setItem(name, value);
          } catch (err) {
            if (err instanceof DOMException && err.name === 'QuotaExceededError') {
              window.alert('저장 공간이 부족합니다. 불필요한 데이터를 정리한 후 다시 시도해주세요.');
            }
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      })),
    }
  )
);
