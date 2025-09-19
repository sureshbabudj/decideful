import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { User } from "firebase/auth";
import { auth } from "../firebase/client";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  setFireBaseToken: (token: string) => void;
  refreshToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        loading: true,
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setLoading: (loading) => set({ loading }),
        logout: () => {
          set({ user: null, token: null });
          auth.signOut();
          // Clear cookie
          document.cookie =
            "firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        },
        refreshToken: async () => {
          const { user } = get();
          if (user) {
            try {
              const token = await user.getIdToken(true);
              set({ token });
              document.cookie = `firebase-token=${token}; path=/; max-age=3600`;
              return token;
            } catch (error) {
              console.error("Error refreshing token:", error);
              return null;
            }
          }
          return null;
        },
        setFireBaseToken: (token: string) => {
          // 24 hours expiry
          document.cookie = `firebase-token=${token}; path=/; max-age=86400`;
          set({ token });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
);
