"use client";

import { AppContext, AppState } from "@/lib/store";
import { useContext } from "react";
import { useStore as useZustandStore } from "zustand";

export function useStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  return useZustandStore(store, selector);
}

export default useStore;
