export type GuestSide = 'groom' | 'bride' | 'shared';
export type GuestRelation = 'family' | 'friend' | 'work' | 'other';
export type RsvpStatus = 'pending' | 'confirmed' | 'declined';
export type MealType = 'standard' | 'vegetarian' | 'none';

export interface Guest {
  id: string;
  name: string;
  side: GuestSide;
  relation: GuestRelation;
  rsvp: RsvpStatus;
  plusOne: boolean;
  meal: MealType;
  table?: number;
  phone?: string;
  memo?: string;
  giftReceived?: boolean;
  giftAmount?: number;
  createdAt: string;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  groomSide: number;
  brideSide: number;
  sharedSide: number;
  totalGiftAmount: number;
  mealCounts: Record<MealType, number>;
}
