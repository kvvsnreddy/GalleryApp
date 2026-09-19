import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER_SESSION: '@user_session',
  REGISTERED_USER: '@registered_user',
  FAVORITES: '@favorites',
} as const;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Storage.set failed for key: ${key}`);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      console.error(`Storage.remove failed for key: ${key}`);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
      console.error('Storage.clear failed');
    }
  },
};
