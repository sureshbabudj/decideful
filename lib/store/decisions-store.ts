import { Decision, Reflection } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { OptionType } from "../schemas/decision.schema";

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
  addReflection: (decisionId: string, reflection: Reflection) => void;
  updateOptions: (
    decisionId: string,
    newOptions: OptionType[],
    reason: string
  ) => void;
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

    addReflection: (decisionId, reflection) =>
      set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === decisionId
            ? {
                ...d,
                reflections: [...d.reflections, reflection].sort(
                  (a, b) =>
                    new Date(a.reflectionDate).getTime() -
                    new Date(b.reflectionDate).getTime()
                ),
                currentReflectionCount: d.currentReflectionCount + 1,
                lastReflectionDate: reflection.reflectionDate,
                updatedAt: new Date(),
              }
            : d
        ),
      })),

    updateOptions: (decisionId, newOptions, reason) =>
      set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === decisionId
            ? {
                ...d,
                options: newOptions,
                optionHistory: [
                  ...d.optionHistory,
                  {
                    timestamp: new Date(),
                    options: newOptions,
                    reason,
                  },
                ],
                updatedAt: new Date(),
              }
            : d
        ),
      })),
  }))
);
