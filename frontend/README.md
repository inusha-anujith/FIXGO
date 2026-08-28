# FIXGO Frontend

React Native (Expo, TypeScript) app for the FIXGO vehicle assistance marketplace, targeting Android and iOS from a single codebase. See the root [README.md](../README.md) for the overall project and folder-structure rationale.

## 1. Stack

| Component | Choice |
|---|---|
| Framework | React Native via **Expo** (managed workflow), TypeScript |
| Styling | NativeWind v4 (Tailwind for React Native) |
| UI Components | Hand-built shadcn-style primitives in `src/components/ui` (`class-variance-authority` + `tailwind-merge`, same conventions as shadcn/ui) |
| Navigation | React Navigation (native-stack) |
| Icons | `lucide-react-native` |
| Font | Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`) — bold geometric sans matching the product's black-pill-button visual style |
| Maps | OpenStreetMap + Leaflet (to be wired in later) |
| Push Notifications | Firebase Cloud Messaging (to be wired in later) |

**Why Expo, not bare React Native CLI:** no native Android/iOS project boilerplate to maintain until it's actually needed (`npx expo prebuild` generates `android/`/`ios/` on demand, e.g. for a custom native module or an EAS build). This matches the spec's low-cost/fast-iteration MVP approach. Switch to bare workflow later with `expo prebuild` if a library requires it — no rewrite needed.

## 2. Structure

Feature-first under `src/features/` (`auth`, `customer`, `provider`, `admin`, `job`, `rating`, `notifications`), shared shadcn-style primitives in `src/components/ui`. See the root README's [Frontend Structure](../README.md#4-frontend-structure-frontend) section for the full tree.

## 3. Getting Started

```bash
cd frontend
npm install
npx expo install --fix   # aligns dependency versions with the installed Expo SDK/toolchain
npm start                # then press 'a' for Android, 'i' for iOS, 'w' for web
```

Requires the Expo Go app (or an emulator/simulator) to run on device. `android/` and `ios/` stay empty until you run `npx expo prebuild` — that's expected under the managed workflow.

## 4. Roles & Auth

Two roles, matching the backend's domain packages and the spec's Customer/Provider split:

| Role (code) | UI label | Notes |
|---|---|---|
| `CUSTOMER` | Vehicle Owner | Creates roadside assistance requests (FR-03). |
| `PROVIDER` | Garage / Service Provider | Mechanic, garage, towing or fuel operator; accepts jobs (FR-07) and goes through admin verification (FR-16) before accepting live jobs. |

The current auth flow (`src/features/auth/`) covers: `WelcomeScreen` → `RoleSelectScreen` → `LoginScreen` / `RegisterScreen`, wired up in `src/navigation/AuthNavigator.tsx` and rendered from the root `App.tsx`. Screens are UI-complete but not yet wired to the backend — forms hold local state only. Next step: add `src/services/api/authService.ts` once the backend's `auth` module exposes real endpoints, and swap `AuthNavigator` for a root navigator that switches between auth/customer/provider/admin stacks based on session state.

## 5. Conventions

- Keep customer, provider and admin flows in separate `features/` folders even where UI overlaps.
- Only cross-feature, reusable UI belongs in `src/components`; feature-specific UI stays inside that feature's folder.
- Shared API calls live in `src/services/api`, not inline in screens/components.
- UI primitives in `src/components/ui` follow shadcn's variant pattern (`cva` for variants, `cn()` — `clsx` + `tailwind-merge` — for class merging) so they stay familiar to anyone who's used shadcn/ui on web.
