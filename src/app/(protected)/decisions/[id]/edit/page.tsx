"use client";

import { useEffect, useState } from "react";
import { DecisionForm } from "@/components/decisions/decision-form";
import { useParams, useRouter } from "next/navigation";
import { Decision } from "@/types";
import { Loader2 } from "lucide-react";

function EditDecisionContent() {
  const params = useParams();
  const router = useRouter();
  const decisionId = params.id as string;
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated loading state and fetching decision from a store or API
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Replace this with actual data fetching logic
    const getDecisionById = (id: string): Decision | null => {
      setLoading(false);
      console.log("Fetching decision with ID:", id);
      return null; // Replace with actual fetching logic
    };

    const loadDecision = () => {
      const foundDecision = getDecisionById(decisionId);
      if (foundDecision) {
        setDecision(foundDecision);
        setIsLoading(false);
      } else {
        // Decision not found in cache, redirect to decisions list
        router.push("/decisions");
      }
    };

    loadDecision();
  }, [decisionId, router]);

  const updateDecision = async (id: string, data: Partial<Decision>) => {
    // Replace this with actual update logic
    console.log("Updating decision with ID:", id, "with data:", data);
  };

  const handleSubmit = async (data: Partial<Decision>) => {
    if (!decision) return;

    try {
      await updateDecision(decision.id, data);
      router.push(`/decisions/${decision.id}`);
    } catch (error) {
      console.error("Failed to update decision:", error);
    }
  };

  if (isLoading || loading) {
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
          isLoading={loading}
          isEditing={true}
        />
      </div>
    </div>
  );
}

export default function EditDecisionPage() {
  return <EditDecisionContent />;
}
