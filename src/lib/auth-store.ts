import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useSyncExternalStore } from "react";

export type User = {
  email: string;
  uid: string;
};

export type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

let state: AuthState = initialState;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function update(updater: (current: AuthState) => AuthState) {
  state = updater(state);
  emit();
}

// Subscribe to Firebase Auth state changes
auth().onAuthStateChanged((firebaseUser: FirebaseAuthTypes.User | null) => {
  if (firebaseUser) {
    update(() => ({
      user: {
        email: firebaseUser.email || "",
        uid: firebaseUser.uid,
      },
      isLoggedIn: true,
    }));
  } else {
    update(() => initialState);
  }
});

export const authStore = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  signIn: async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      let message = "An unknown error occurred";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        message = "Неверный email или пароль";
      } else if (error.code === "auth/invalid-email") {
        message = "Некорректный email";
      } else if (error.code === "auth/user-disabled") {
        message = "Пользователь заблокирован";
      }
      throw new Error(message);
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      let message = "An unknown error occurred";
      if (error.code === "auth/email-already-in-use") {
        message = "Этот email уже используется";
      } else if (error.code === "auth/invalid-email") {
        message = "Некорректный email";
      } else if (error.code === "auth/weak-password") {
        message = "Слишком слабый пароль";
      }
      throw new Error(message);
    }
  },
  signOut: async () => {
    await auth().signOut();
  },
};

export function useAuth() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.get,
    authStore.get,
  );
}
