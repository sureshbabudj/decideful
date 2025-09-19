"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Sidebar as AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setToken, setLoading, loading, setFireBaseToken } =
    useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get fresh token
          const token = await user.getIdToken();
          setUser(user);
          setToken(token);
          setLoading(false);

          // Update cookie with fresh token
          setFireBaseToken(token);
        } catch (error) {
          console.error("Error getting token:", error);
          setUser(null);
          setToken(null);
          setLoading(false);
          setFireBaseToken("");
        }
      } else {
        setUser(null);
        setToken(null);
        setLoading(false);
        setFireBaseToken("");
        router.push("/login");
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router, setUser, setToken, setLoading, setFireBaseToken]);

  if (isCheckingAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="text-foreground">
        <Header />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
