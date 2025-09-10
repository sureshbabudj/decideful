"use client";

import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useStore from "@/hooks/use-store";

const AUTH_PATHS = ["/login", "/register"];
const PROTECTED_PATHS = ["/dashboard", "/decisions", "/profile", "/settings"];
const DEFAULT_AUTH_REDIRECT = "/dashboard";
const DEFAULT_LOGIN_REDIRECT = "/login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const setUser = useStore((state) => state.setUser);
  const user = useStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // set cookies __session
        const idToken = await user.getIdToken();
        document.cookie = `__session=${idToken}; path=/;`;
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (!loading) {
      if (user && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
        redirect(DEFAULT_AUTH_REDIRECT);
      }
      if (!user && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
        redirect(DEFAULT_LOGIN_REDIRECT);
      }
    }
  }, [loading, user, pathname]);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">Loading...</div>
    );
  }

  return <>{children}</>;
}
