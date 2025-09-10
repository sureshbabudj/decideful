"use client";

import { createContext } from "react";
import { createStore } from "zustand";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const AUTH_ERROR_CODES = {
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",
} as const;

export interface AppProps {
  user: User | null;
}

export interface AppState extends AppProps {
  signIn: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  signOutUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export const createAppStore = (initProps?: Partial<AppProps>) => {
  const DEFAULT_PROPS: AppProps = {
    user: null,
  };
  return createStore<AppState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    signIn: async (email, password) => {
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        set({ user });
        return user;
      } catch (error) {
        const message =
          AUTH_ERROR_CODES[
            (error as { code?: string }).code as keyof typeof AUTH_ERROR_CODES
          ] || "An unexpected error occurred. Please try again.";
        throw new Error(message);
      }
    },
    signInWithGoogle,
    register: async (name, email, password) => {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
        set({ user });
        return user;
      } catch (error) {
        const message =
          AUTH_ERROR_CODES[
            (error as { code?: string }).code as keyof typeof AUTH_ERROR_CODES
          ] || "An unexpected error occurred. Please try again.";
        throw new Error(message);
      }
    },
    signOutUser: async () => {
      await signOut(auth);
      set({ user: null });
    },
    setUser: (user) => set({ user }),
    updateProfile: async (data) => {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
      }
      await updateProfile(auth.currentUser, data);
      set({ user: { ...auth.currentUser } as User });
    },
  }));
};

export type AppStore = ReturnType<typeof createAppStore>;
export const AppContext = createContext<AppStore | null>(null);
