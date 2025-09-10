"use client";
import { useRef } from "react";
import { AppContext, AppProps, AppStore, createAppStore } from ".";
import AuthGuard from "@/components/auth/auth-guard";

type AppProviderProps = React.PropsWithChildren<AppProps>;

export function AppProvider({ children, ...props }: AppProviderProps) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = createAppStore(props);
  }

  return (
    <AppContext.Provider value={storeRef.current}>
      <AuthGuard>{children}</AuthGuard>
    </AppContext.Provider>
  );
}
