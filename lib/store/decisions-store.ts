import { Decision } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DecisionsState {
  decisions: Decision[];
  loading: boolean;
  selectedDecision: Decision | null;
  setDecisions: (decisions: Decision[]) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (id: string, decision: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  setSelectedDecision: (decision: Decision | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useDecisionsStore = create<DecisionsState>()(
  devtools((set) => ({
    decisions: [],
    loading: false,
    selectedDecision: null,
    setDecisions: (decisions) => set({ decisions }),
    addDecision: (decision) =>
      set((state) => ({
        decisions: [decision, ...state.decisions],
      })),
    updateDecision: (id, updatedDecision) =>
      set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id ? { ...d, ...updatedDecision } : d
        ),
      })),
    deleteDecision: (id) =>
      set((state) => ({
        decisions: state.decisions.filter((d) => d.id !== id),
      })),
    setSelectedDecision: (decision) => set({ selectedDecision: decision }),
    setLoading: (loading) => set({ loading }),
  }))
);
