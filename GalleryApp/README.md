# 📸 GalleryApp — React Native Intern Assignment

A full-featured React Native application with TypeScript demonstrating authentication, image gallery, favorites, and profile management.

---

## 🚀 Setup & Running Instructions

### Prerequisites
- Node.js v18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone OR Android/iOS emulator

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd GalleryApp

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Run on device
# • Press 'a' for Android emulator
# • Press 'i' for iOS simulator
# • Scan QR code with Expo Go app (physical device)
```

### Build APK (Android)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## 📁 Folder Structure

```
src/
├── api/
│   └── picsumApi.ts          # Axios API service for Picsum Photos
├── assets/
│   └── images/               # Static assets
├── components/               # Reusable UI components
│   ├── Button.tsx            # Multi-variant button (primary/secondary/danger/outline)
│   ├── InputField.tsx        # Labeled input with error state & password toggle
│   ├── ImageCard.tsx         # Grid card with thumbnail, author, favorite toggle
│   ├── Dropdown.tsx          # Modal-based dropdown selector
│   └── LoadingSpinner.tsx    # Centered activity indicator
├── hooks/                    # Custom React hooks
│   ├── useFetchImages.ts     # Paginated API hook with duplicate-call guard (useRef)
│   ├── useDebounce.ts        # Debounce hook for search inputs
│   └── useAuth.ts            # Auth store selector shortcut
├── navigation/               # React Navigation setup
│   ├── RootNavigator.tsx     # Conditional Auth/Main routing
│   ├── AuthNavigator.tsx     # Login + Register stack
│   └── MainTabNavigator.tsx  # Home / Favorites / Profile tabs
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.tsx   # Email + password login with validation
│   │   └── RegisterScreen.tsx# Full registration form (8 fields + validation)
│   └── Main/
│       ├── HomeScreen.tsx    # Gallery grid with search, filter, infinite scroll
│       ├── FavoritesScreen.tsx # Saved images with search
│       ├── ImageDetailScreen.tsx # Full-size viewer + download + share
│       └── ProfileScreen.tsx # View/edit profile + logout
├── store/                    # Zustand global state
│   ├── useAuthStore.ts       # Auth session state + AsyncStorage persistence
│   └── useGalleryStore.ts    # Favorites state + AsyncStorage persistence
├── types/                    # TypeScript interfaces
│   ├── auth.ts
│   ├── gallery.ts
│   └── navigation.ts
└── utils/
    ├── storage.ts            # AsyncStorage helper with typed get/set/remove
    └── validation.ts         # Form validation functions
```

---

## 📚 Libraries Used

| Library | Purpose |
|---|---|
| `react-navigation` | Stack + Tab navigation |
| `zustand` | Lightweight centralized state management |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `axios` | HTTP client for Picsum Photos API |
| `expo-media-library` | Save images to device gallery |
| `expo-file-system` | Download image files locally |
| `expo-sharing` | Native share sheet |

---

## 🏗️ Architecture & Key Decisions

### State Management
- **Zustand** stores handle auth (`useAuthStore`) and gallery favorites (`useGalleryStore`).
- Both stores sync directly to `AsyncStorage` on every mutation, ensuring persistence across sessions with no manual rehydration steps.

### Authentication Flow
- Registered user data is saved to `AsyncStorage` under a dedicated key.
- Login validates email/password against the stored record locally.
- Session persistence: on app start, `loadSession()` reads `@user_session` and auto-navigates to Home if valid.

### Search & Filter
- Search is debounced (350ms) via `useDebounce` to prevent excessive re-renders during rapid typing.
- `useMemo` combines search query + filter mode into a single derived list, running only when dependencies change.
- Both search and filter operate on the locally loaded image list (not the API), so they work offline after initial load.

### Pull-to-Refresh (Duplicate Call Prevention)
- `useFetchImages` uses a `useRef` boolean flag (`isFetchingRef`) as a guard.
- If a fetch is already in-flight, any new call (from `loadMore` or `onRefresh`) returns early immediately.
- This prevents duplicate API requests from concurrent gestures.

### Pagination
- Infinite scroll implemented via FlatList's `onEndReached` + `onEndReachedThreshold={0.5}`.
- A `hasMore` flag stops further fetches when the API returns fewer than `PAGE_LIMIT` items.

### Image Download
- Downloads use `expo-file-system` to write to `documentDirectory`, then `expo-media-library` to save to the system gallery.
- Requests `WRITE_EXTERNAL_STORAGE` permission on Android (configured in `app.json`).

---

## ✅ Features Implemented

- [x] Registration with 8 fields + full validation
- [x] Login with credential validation against local storage
- [x] Session persistence (auto-login on restart)
- [x] Image gallery with FlatList + 2-column grid
- [x] Infinite scroll pagination
- [x] Pull-to-refresh with duplicate-call guard
- [x] Real-time debounced author search
- [x] A-M / N-Z filter (works with search simultaneously)
- [x] Favorite/unfavorite images with persistence
- [x] Dedicated Favorites screen with search
- [x] Image Detail screen with full-size view
- [x] Download image to device gallery
- [x] Share image via native share sheet
- [x] Profile screen (view + edit)
- [x] Logout with session clearing
- [x] Error handling for API failures + empty states

## 🌟 Bonus Features

- [x] Debounced search (350ms)
- [x] Custom reusable hooks (`useFetchImages`, `useDebounce`, `useAuth`)
- [x] Reusable UI components (Button, InputField, Dropdown, ImageCard, LoadingSpinner)
- [x] Avatar selection on profile screen
- [x] TypeScript throughout (strict mode)
