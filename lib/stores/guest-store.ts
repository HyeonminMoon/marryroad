import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Guest, GuestStats, RsvpStatus, GuestSide, GuestRelation, MealType } from '@/lib/types/guest';

interface GuestStore {
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
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

      getStats: () => {
        const { guests } = get();
        const stats: GuestStats = {
          total: guests.length,
          confirmed: guests.filter(g => g.rsvp === 'confirmed').length,
          declined: guests.filter(g => g.rsvp === 'declined').length,
          pending: guests.filter(g => g.rsvp === 'pending' || g.rsvp === 'maybe').length,
          groomSide: guests.filter(g => g.side === 'groom').length,
          brideSide: guests.filter(g => g.side === 'bride').length,
          totalGiftAmount: guests.reduce((sum, g) => sum + (g.giftAmount || 0), 0),
          mealCounts: {
            standard: guests.filter(g => g.meal === 'standard' && g.rsvp === 'confirmed').length,
            vegetarian: guests.filter(g => g.meal === 'vegetarian' && g.rsvp === 'confirmed').length,
            none: guests.filter(g => g.meal === 'none' && g.rsvp === 'confirmed').length,
          },
        };
        // Count +1 guests
        const plusOnes = guests.filter(g => g.plusOne && g.rsvp === 'confirmed').length;
        stats.confirmed += plusOnes;
        stats.total += guests.filter(g => g.plusOne).length;
        return stats;
      },
    }),
    {
      name: 'marryroad-guests',
    }
  )
);
