import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";

export type User = {
  email: string;
};

export type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
};

const STORAGE_KEY = "grantstep.auth-state";

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

let state: AuthState = initialState;
let hydrated = false;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Demo storage should not break UI
  }
}

async function hydrate() {
  if (hydrated) return;
  hydrated = true;

  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    state = {
      user: parsed.user ?? initialState.user,
      isLoggedIn: parsed.isLoggedIn ?? initialState.isLoggedIn,
    };
    emit();
  } catch {
    state = initialState;
  }
}

function update(updater: (current: AuthState) => AuthState) {
  state = updater(state);
  emit();
  void persist();
}

export const authStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    void hydrate();
    return () => listeners.delete(listener);
  },
  signIn: async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    update(() => ({
      user: { email },
      isLoggedIn: true,
    }));
  },
  signUp: async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    update(() => ({
      user: { email },
      isLoggedIn: true,
    }));
  },
  signOut: () => {
    update(() => initialState);
  },
};

export function useAuth() {
  useEffect(() => {
    void hydrate();
  }, []);

  return useSyncExternalStore(
    authStore.subscribe,
    authStore.get,
    authStore.get,
  );
}
