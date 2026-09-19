import { create } from 'zustand';
import { User } from '../types/auth';
import { storage, StorageKeys } from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (userData: User) => {
    await storage.set(StorageKeys.USER_SESSION, userData);
    set({ user: userData, isAuthenticated: true });
  },

  logout: async () => {
    await storage.remove(StorageKeys.USER_SESSION);
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    const session = await storage.get<User>(StorageKeys.USER_SESSION);
    if (session) {
      set({ user: session, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  updateUser: async (updatedData: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updatedData };
    await storage.set(StorageKeys.USER_SESSION, updated);
    // Also update the registered user record
    await storage.set(StorageKeys.REGISTERED_USER, updated);
    set({ user: updated });
  },
}));
