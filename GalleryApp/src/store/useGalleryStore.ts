import { create } from 'zustand';
import { PicsumImage } from '../types/gallery';
import { storage, StorageKeys } from '../utils/storage';

interface GalleryState {
  favorites: PicsumImage[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],

  loadFavorites: async () => {
    const saved = await storage.get<PicsumImage[]>(StorageKeys.FAVORITES);
    set({ favorites: saved ?? [] });
  },

  toggleFavorite: async (image: PicsumImage) => {
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === image.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== image.id)
      : [...favorites, image];
    await storage.set(StorageKeys.FAVORITES, updated);
    set({ favorites: updated });
  },

  isFavorite: (id: string) => {
    return get().favorites.some((f) => f.id === id);
  },

  removeFavorite: async (id: string) => {
    const { favorites } = get();
    const updated = favorites.filter((f) => f.id !== id);
    await storage.set(StorageKeys.FAVORITES, updated);
    set({ favorites: updated });
  },
}));
