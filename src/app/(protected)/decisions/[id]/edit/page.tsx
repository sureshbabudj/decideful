"use client";

import { useEffect, useState } from "react";
import { DecisionForm } from "@/components/decisions/decision-form";
import { useParams, useRouter } from "next/navigation";
import { Decision } from "@/types";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { snapToTyped } from "@/lib/firebase/utils";
import { decisionSchema } from "@/types/transformSchema";
import { DecisionFormData } from "@/utils/validation";
import { toast } from "sonner";

function EditDecisionContent() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // Replace this with actual data fetching logic
    const getDecisionById = async (id: string): Promise<Decision | null> => {
      if (!user) {
        return null;
      }
      const decisionsRef = collection(db, "users", user.uid, "decisions");
      const q = query(decisionsRef, orderBy("updatedAt", "desc"));
      const snap = await getDocs(q);

      let foundDecision: Decision | null = null;
      snap.forEach((docSnap) => {
        if (docSnap.id === id) {
          foundDecision = { id: docSnap.id, ...docSnap.data() } as Decision;
        }
      });
      return foundDecision;
    };

    const loadDecision = async () => {
      const foundDecision = await getDecisionById(decisionId);
      if (foundDecision) {
        const parsed = snapToTyped(
          { id: foundDecision.id, data: () => ({ ...foundDecision }) },
          decisionSchema
        );
        setDecision(parsed);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.push("/decisions");
      }
    };

    loadDecision();
  }, [decisionId, router, user]);

  const updateDecision = async (id: string, data: Partial<Decision>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const decisionRef = doc(db, "users", user.uid, "decisions", id);
    await updateDoc(decisionRef, data);
  };

  const handleSubmit = async (data: DecisionFormData) => {
    setIsLoading(true);
    try {
      const {
        title,
        context,
        finalChoice,
        expectedOutcome,
        reviewDate,
        milestones,
      } = data;
      await updateDecision(decisionId, {
        title,
        context,
        finalChoice,
        expectedOutcome,
        reviewDate: new Date(reviewDate),
        status: "pending",
        milestones: milestones.map((milestone) => ({
          id: crypto.randomUUID(),
          description: milestone.description,
          expectedDate: new Date(milestone.expectedDate),
          category: milestone.category,
        })),
        updatedAt: new Date(),
      });
      router.push(`/decisions/${decisionId}`);
    } catch (error) {
      toast.error(
        `Failed to update decision: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (!decision) {
    return (
      <div>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Decision Not Found
          </h1>
          <p className="text-gray-400">
            The decision you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Decision</h1>
          <p className="text-gray-400">
            Update your decision entry details and milestones.
          </p>
        </div>
        <DecisionForm
          initialData={{
            ...decision,
            reviewDate:
              decision.reviewDate instanceof Date
                ? decision.reviewDate.toISOString().split("T")[0]
                : decision.reviewDate,
            milestones:
              decision.milestones?.map((milestone) => ({
                ...milestone,
                expectedDate:
                  milestone.expectedDate instanceof Date
                    ? milestone.expectedDate.toISOString().split("T")[0]
                    : milestone.expectedDate,
              })) || [],
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEditing={true}
        />
      </div>
    </div>
  );
}

export default function EditDecisionPage() {
  return <EditDecisionContent />;
}
