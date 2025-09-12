"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Decision, OutcomeFormData } from "@/types";
import { CheckCircle, CheckSquareIcon, Loader2, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { DialogHeader, DialogFooter } from "../ui/dialog";

// Internal form data type (before transformation)
type OutcomeFormInput = {
  actualOutcome: string;
  expectationCorrect: string;
  keyLearnings: string;
  milestoneUpdates: {
    id: string;
    achieved: boolean;
    notes?: string;
  }[];
};

// Validation schema for outcome form
const outcomeFormSchema = z.object({
  actualOutcome: z
    .string()
    .min(1, "Actual outcome is required")
    .max(2000, "Actual outcome must be less than 2000 characters"),
  expectationCorrect: z.string(),
  keyLearnings: z
    .string()
    .min(1, "Key learnings are required")
    .max(2000, "Key learnings must be less than 2000 characters"),
  milestoneUpdates: z.array(
    z.object({
      id: z.string(),
      achieved: z.boolean(),
      notes: z
        .string()
        .max(500, "Notes must be less than 500 characters")
        .optional(),
    })
  ),
});

interface OutcomeFormProps {
  decision: Decision;
  onSubmit: (data: OutcomeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const OutcomeForm: React.FC<OutcomeFormProps> = ({
  decision,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [showExpectationToggle, setShowExpectationToggle] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OutcomeFormInput>({
    resolver: zodResolver(outcomeFormSchema),
    defaultValues: {
      actualOutcome: decision.actualOutcome || "",
      expectationCorrect:
        decision.expectationCorrect !== undefined
          ? decision.expectationCorrect.toString()
          : "true",
      keyLearnings: decision.keyLearnings || "",
      milestoneUpdates: decision.milestones.map((milestone) => ({
        id: milestone.id,
        achieved: milestone.achieved ?? false,
        notes: milestone.notes || "",
      })),
    },
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control,
    name: "milestoneUpdates",
  });

  const watchedExpectationCorrect = watch("expectationCorrect");

  const handleFormSubmit = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    const formData = watch(); // Get current form data

    // Transform the form data to match OutcomeFormData interface
    const data: OutcomeFormData = {
      actualOutcome: formData.actualOutcome,
      expectationCorrect: formData.expectationCorrect === "true",
      keyLearnings: formData.keyLearnings,
      milestoneUpdates: formData.milestoneUpdates,
    };

    try {
      setShowConfirmation(false);
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to submit outcome:", error);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const toggleMilestoneAchievement = (index: number, achieved: boolean) => {
    setValue(`milestoneUpdates.${index}.achieved`, achieved, {
      shouldValidate: true,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      skill: "bg-blue-100 text-blue-800",
      money: "bg-green-100 text-green-800",
      network: "bg-purple-100 text-purple-800",
      familiarity: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className=" rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold  mb-2">
          Log Decision Outcome
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review your decision and record what actually happened compared to
          your expectations.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Original Expectations Reminder */}
        <div className="bg-primary/5 border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Original Expectations</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-accent-foreground">
                Expected Outcome:
              </h4>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {decision.expectedOutcome}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-accent-foreground">
                Final Choice:
              </h4>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {decision.finalChoice}
              </p>
            </div>
          </div>
        </div>

        {/* Actual Outcome */}
        <div>
          <label
            htmlFor="actualOutcome"
            className="block text-sm font-medium mb-2"
          >
            What Actually Happened? *
          </label>
          <textarea
            id="actualOutcome"
            {...register("actualOutcome")}
            rows={4}
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-sm ${
              errors.actualOutcome ? "border-red-300" : "border-border"
            }`}
            placeholder="Describe what actually happened as a result of your decision..."
          />
          {errors.actualOutcome && (
            <p className="mt-1 text-sm text-red-600">
              {errors.actualOutcome.message}
            </p>
          )}
        </div>

        {/* Expectation vs Reality Toggle */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium ">
              Compare to Original Expectations
            </label>
            <button
              type="button"
              onClick={() => setShowExpectationToggle(!showExpectationToggle)}
              className="text-sm text-primary hover:text-primary/90 transition-colors"
            >
              {showExpectationToggle ? "Hide" : "Show"} Comparison
            </button>
          </div>

          {showExpectationToggle && (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium ">
                  Was your expectation correct?
                </span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register("expectationCorrect", {
                        setValueAs: (value) => value === "true",
                      })}
                      value="true"
                      className="h-4 w-4 text-primary focus:ring-primary border-border"
                    />
                    <span className="ml-2 text-sm ">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register("expectationCorrect", {
                        setValueAs: (value) => value === "true",
                      })}
                      value="false"
                      className="h-4 w-4 text-primary focus:ring-primary border-border"
                    />
                    <span className="ml-2 text-sm ">No</span>
                  </label>
                </div>
              </div>
              {watchedExpectationCorrect !== undefined && (
                <div className="mt-3 p-3 rounded-md  border">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        watchedExpectationCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {watchedExpectationCorrect
                        ? "Expectation Met"
                        : "Expectation Not Met"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Milestone Achievement Tracking */}
        {decision.milestones.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold  mb-4">
              Milestone Achievement
            </h3>
            <div className="space-y-4">
              {fields.map((field, index) => {
                const milestone = decision.milestones[index];
                const milestoneUpdate = watch(`milestoneUpdates.${index}`);

                return (
                  <div
                    key={field.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium ">
                            {milestone.description}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              milestone.category
                            )}`}
                          >
                            {milestone.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Expected: {formatDate(milestone.expectedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Achievement Status */}
                      <div>
                        <label className="text-sm font-medium  mb-2 block">
                          Achievement Status:{" "}
                          <span
                            className={
                              milestoneUpdate.achieved
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {milestoneUpdate.achieved
                              ? "Achieved"
                              : "Not Achieved"}
                          </span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <Button
                            type="button"
                            onClick={() =>
                              toggleMilestoneAchievement(index, true)
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Achieved
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              toggleMilestoneAchievement(index, false)
                            }
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Not Achieved
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label
                          htmlFor={`milestoneNotes-${index}`}
                          className="block text-sm font-medium  mb-1"
                        >
                          Notes (Optional)
                        </label>
                        <textarea
                          id={`milestoneNotes-${index}`}
                          {...register(`milestoneUpdates.${index}.notes`)}
                          rows={2}
                          className="w-full px-3 py-3 sm:py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-sm"
                          placeholder="Add any notes about this milestone..."
                        />
                        {errors.milestoneUpdates?.[index]?.notes && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.milestoneUpdates[index]?.notes?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Learnings */}
        <div>
          <label
            htmlFor="keyLearnings"
            className="block text-sm font-medium  mb-2"
          >
            Key Learnings *
          </label>
          <textarea
            id="keyLearnings"
            {...register("keyLearnings")}
            rows={4}
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-sm ${
              errors.keyLearnings ? "border-red-300" : "border-border"
            }`}
            placeholder="What did you learn from this decision? What would you do differently next time?"
          />
          {errors.keyLearnings && (
            <p className="mt-1 text-sm text-red-600">
              {errors.keyLearnings.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-3 sm:py-2 border border-border rounded-md shadow-sm text-sm font-medium   hover:focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
          >
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            {isSubmitting ? "Saving..." : "Complete Review"}
          </button>
        </div>
      </form>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Decision Review</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <CheckSquareIcon className="mx-auto mb-2 w-12 h-12 text-green-500" />
            <div className="text-sm text-muted-foreground mb-6">
              Are you sure you want to complete this decision review? This will
              mark the decision as &quot;Reviewed&quot; and save all outcome
              data. This action cannot be undone.
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleCancelConfirmation}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 size="sm" className="mr-2 animate-spin" />
                )}
                {isSubmitting ? "Completing..." : "Complete Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};
