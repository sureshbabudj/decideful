"use client";

import { DecisionForm } from "@/components/decisions/decision-form";
import useStore from "@/hooks/use-store";
import { createDecision } from "@/lib/firestore";
import { DecisionFormData } from "@/utils/validation";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateDecision() {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    return redirect("/login");
  }

  const handleSubmit = async (data: DecisionFormData) => {
    setLoading(true);
    try {
      const {
        title,
        context,
        finalChoice,
        expectedOutcome,
        reviewDate,
        milestones,
      } = data;
      const { data: newDecisionId } = await createDecision({
        title,
        context,
        finalChoice,
        expectedOutcome,
        reviewDate: new Date(reviewDate),
        userId: user.uid,
        status: "pending",
        milestones: milestones.map((milestone) => ({
          id: crypto.randomUUID(),
          description: milestone.description,
          expectedDate: new Date(milestone.expectedDate),
          category: milestone.category,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      if (newDecisionId) {
        router.push(`/decisions/${newDecisionId}`);
      }
    } catch (error) {
      toast.error(
        `Failed to create decision: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Start a Fresh Decision
          </h1>
          <p className="text-xs sm:text-sm mdtext-muted-foreground">
            Take charge of your journey, one choice at a time, to track your
            reasoning and outcomes.
          </p>
        </div>
        <DecisionForm
          onSubmit={handleSubmit}
          isLoading={loading}
          isEditing={false}
        />
      </div>
    </div>
  );
}
