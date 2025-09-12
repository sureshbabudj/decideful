"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Decision, Milestone, OutcomeFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  CheckCircle,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDate } from "date-fns";
import { OutcomeForm } from "./outcome-form";

interface DecisionDetailProps {
  decision: Decision;
}

export const DecisionDetail: React.FC<DecisionDetailProps> = ({ decision }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const updateDecisionWithOutcome = (
    decisionId: string,
    outcome: OutcomeFormData
  ) => {
    console.log("Updating decision with outcome:", decisionId, outcome);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleEditDecision = () => {
    router.push(`/decisions/${decision.id}/edit`);
  };

  const handleShowOutcomeForm = () => {
    setShowOutcomeForm(true);
  };

  const handleCancelOutcomeForm = () => {
    setShowOutcomeForm(false);
  };

  const handleSubmitOutcome = async (outcomeData: OutcomeFormData) => {
    if (!decision) return;

    try {
      setIsSubmittingOutcome(true);
      await updateDecisionWithOutcome(decision.id, outcomeData);

      // Reload the decision to get updated data
      // const updatedDecision = await getDecision(decisionId);
      // setDecision(updatedDecision);
      setShowOutcomeForm(false);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error("Failed to submit outcome:", error);
      // Error handling is managed by the context
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Decision</AlertTitle>
            <AlertDescription>
              {error}
              <Button
                onClick={handleBackToDashboard}
                variant="destructive"
                className="mt-4"
              >
                Back to Dashboard
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Decision Not Found</AlertTitle>
            <AlertDescription>
              The decision you&apos;re looking for doesn&apos;t exist or has
              been deleted.
              <Button onClick={handleBackToDashboard} className="mt-4">
                Back to Dashboard
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const sortMilestonesByDate = (milestones: Milestone[]) => {
    return milestones.sort((a, b) => {
      return (
        new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime()
      );
    });
  };

  const getOverdueMilestones = (milestones: Milestone[]) => {
    const now = new Date();
    return milestones.filter((milestone) => {
      return milestone.expectedDate < now && milestone.achieved !== true;
    });
  };

  const isDecisionOverdue = (decision: Decision) => {
    const now = new Date();
    return decision.reviewDate < now && decision.status !== "reviewed";
  };

  const sortedMilestones = sortMilestonesByDate(decision.milestones);
  const overdueMilestones = getOverdueMilestones(decision.milestones);
  const isOverdue = isDecisionOverdue(decision);

  const getStatusBadge = (status: string) => {
    if (status === "reviewed") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Reviewed
        </Badge>
      );
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Pending
      </Badge>
    );
  };

  const getMilestoneStatusIcon = (milestone: Milestone) => {
    if (milestone.achieved === true) {
      return (
        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    if (milestone.achieved === false) {
      return (
        <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 text-red-600" />
        </div>
      );
    }

    const isOverdue = new Date() > milestone.expectedDate;
    return (
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          isOverdue ? "bg-destructive/10" : "bg-muted"
        }`}
      >
        <Clock
          className={`w-3 h-3 ${
            isOverdue ? "text-destructive" : "text-muted-foreground"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="p-1 sm:p-2 lg:p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="justify-start p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
          {decision.status === "pending" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Button onClick={handleShowOutcomeForm}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Log Outcome
              </Button>
              <Button variant="outline" onClick={handleEditDecision}>
                <Edit className="w-4 h-4 mr-1" />
                Edit Decision
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            {decision.title}
          </h1>
          <div className="self-start sm:self-auto">
            {getStatusBadge(decision.status)}
          </div>
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          Created on {formatDate(decision.createdAt, "PP")} • Review by{" "}
          {formatDate(decision.reviewDate, "PP")}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Decision Review Completed!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your decision outcome has been successfully logged and the
                  decision status has been updated to &quot;Reviewed&quot;.
                </p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setShowSuccessMessage(false)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Alert */}
      {(isOverdue || overdueMilestones.length > 0) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Attention Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {isOverdue && <p>This decision is overdue for review.</p>}
                {overdueMilestones.length > 0 && (
                  <p>
                    {overdueMilestones.length} milestone
                    {overdueMilestones.length > 1 ? "s are" : " is"} overdue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Form */}
      {showOutcomeForm ? (
        <OutcomeForm
          decision={decision}
          onSubmit={handleSubmitOutcome}
          onCancel={handleCancelOutcomeForm}
          isSubmitting={isSubmittingOutcome}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Decision Context */}
            <div className="bg-muted-foreground/10 rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Context & Background
              </h2>
              <p className="text-sm sm:text-base  whitespace-pre-wrap">
                {decision.context}
              </p>
            </div>

            {/* Final Choice */}
            <div className="bg-muted-foreground/10 rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Final Choice
              </h2>
              <p className="text-sm sm:text-base  whitespace-pre-wrap">
                {decision.finalChoice}
              </p>
            </div>

            {/* Expected Outcome */}
            <div className="bg-muted-foreground/10 rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Expected Outcome
              </h2>
              <p className="text-sm sm:text-base  whitespace-pre-wrap">
                {decision.expectedOutcome}
              </p>
            </div>

            {/* Actual Outcome (if reviewed) */}
            {decision.status === "reviewed" && decision.actualOutcome && (
              <div className="bg-muted-foreground/10 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Actual Outcome</h2>
                <p className=" whitespace-pre-wrap">{decision.actualOutcome}</p>

                {decision.expectationCorrect !== undefined && (
                  <div className="mt-4 p-3 rounded-m">
                    <div className="flex items-center">
                      <span className="text-sm font-medium  mr-2">
                        Expectation was correct:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          decision.expectationCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {decision.expectationCorrect ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Learnings (if reviewed) */}
            {decision.status === "reviewed" && decision.keyLearnings && (
              <div className="bg-muted-foreground/10 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Key Learnings</h2>
                <p className=" whitespace-pre-wrap">{decision.keyLearnings}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Decision Info */}
            <div className="bg-muted-foreground/10 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Decision Info</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Status
                  </dt>
                  <dd className="mt-1">{getStatusBadge(decision.status)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formatDate(decision.createdAt, "PP")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Review Date
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formatDate(decision.reviewDate, "PP")}
                  </dd>
                </div>
                {decision.updatedAt &&
                  decision.updatedAt.getTime() !==
                    decision.createdAt.getTime() && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </dt>
                      <dd className="mt-1 text-sm">
                        {formatDate(decision.updatedAt, "PP")}
                      </dd>
                    </div>
                  )}
              </dl>
            </div>

            {/* Milestones */}
            {sortedMilestones.length > 0 && (
              <div className="bg-muted-foreground/10 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Milestones ({sortedMilestones.length})
                </h3>
                <div className="space-y-4">
                  {sortedMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start space-x-3"
                    >
                      {getMilestoneStatusIcon(milestone)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {milestone.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {milestone.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expected: {formatDate(milestone.expectedDate, "PP")}
                        </p>
                        {milestone.notes && (
                          <p className="text-xs text-gray-600 mt-1 italic">
                            {milestone.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
