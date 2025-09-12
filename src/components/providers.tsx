"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { auth } from "@/lib/firebase/client";
import { onIdTokenChanged, reload } from "firebase/auth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const loading = useAuthStore((s) => s.loading);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setToken(null);
        return; // middleware handles redirect to /login
      }

      setUser(user);

      // keep session cookie in sync after client-side changes
      const token = await user.getIdToken();
      try {
        const response = await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error setting session cookie:", error);
        await auth.signOut();
        setUser(null);
        setToken(null);
        return;
      }

      setToken(token);
    });

    return () => unsub();
  }, [setToken, setUser]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {loading ? (
        <div className="p-4 h-dvh flex items-center justify-center text-4xl">
          <Loader2 className="animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        <>{children}</>
      )}
    </NextThemesProvider>
  );
}
