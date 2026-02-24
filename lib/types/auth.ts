import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => void;
}

export type AuthStore = AuthState & AuthActions;
