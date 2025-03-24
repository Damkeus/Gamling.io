import { create } from 'zustand';
import { User } from '../types/database';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  demoLogin: () => void;
  isDemoMode: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isDemoMode: false,
  setUser: (user) => set({ user }),
  demoLogin: () => {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@example.com',
      tokens: 1000,
      created_at: new Date().toISOString()
    };
    set({ user: demoUser, isDemoMode: true });
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isDemoMode: false });
  },
}));