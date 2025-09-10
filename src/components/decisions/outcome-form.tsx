"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Decision, OutcomeFormData } from "@/types";
import { Loader2 } from "lucide-react";

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
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Log Decision Outcome
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Review your decision and record what actually happened compared to
          your expectations.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Original Expectations Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Original Expectations
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Expected Outcome:
              </h4>
              <p className="text-sm text-blue-700 mt-1 whitespace-pre-wrap">
                {decision.expectedOutcome}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Final Choice:
              </h4>
              <p className="text-sm text-blue-700 mt-1 whitespace-pre-wrap">
                {decision.finalChoice}
              </p>
            </div>
          </div>
        </div>

        {/* Actual Outcome */}
        <div>
          <label
            htmlFor="actualOutcome"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What Actually Happened? *
          </label>
          <textarea
            id="actualOutcome"
            {...register("actualOutcome")}
            rows={4}
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
              errors.actualOutcome ? "border-red-300" : "border-gray-300"
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
            <label className="text-sm font-medium text-gray-700">
              Compare to Original Expectations
            </label>
            <button
              type="button"
              onClick={() => setShowExpectationToggle(!showExpectationToggle)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showExpectationToggle ? "Hide" : "Show"} Comparison
            </button>
          </div>

          {showExpectationToggle && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register("expectationCorrect", {
                        setValueAs: (value) => value === "true",
                      })}
                      value="false"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
              {watchedExpectationCorrect !== undefined && (
                <div className="mt-3 p-3 rounded-md bg-white border">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Milestone Achievement
            </h3>
            <div className="space-y-4">
              {fields.map((field, index) => {
                const milestone = decision.milestones[index];
                const milestoneUpdate = watch(`milestoneUpdates.${index}`);

                return (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
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
                        <p className="text-xs text-gray-500">
                          Expected: {formatDate(milestone.expectedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Achievement Status */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Achievement Status
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleMilestoneAchievement(index, true)
                            }
                            className={`flex items-center justify-center px-3 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                              milestoneUpdate?.achieved === true
                                ? "bg-green-100 text-green-800 border-2 border-green-300"
                                : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Achieved
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toggleMilestoneAchievement(index, false)
                            }
                            className={`flex items-center justify-center px-3 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] touch-manipulation ${
                              milestoneUpdate?.achieved === false
                                ? "bg-red-100 text-red-800 border-2 border-red-300"
                                : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Not Achieved
                          </button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label
                          htmlFor={`milestoneNotes-${index}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Notes (Optional)
                        </label>
                        <textarea
                          id={`milestoneNotes-${index}`}
                          {...register(`milestoneUpdates.${index}.notes`)}
                          rows={2}
                          className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
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
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Key Learnings *
          </label>
          <textarea
            id="keyLearnings"
            {...register("keyLearnings")}
            rows={4}
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
              errors.keyLearnings ? "border-red-300" : "border-gray-300"
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
          >
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            {isSubmitting ? "Saving..." : "Complete Review"}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Complete Decision Review
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to complete this decision review? This
                will mark the decision as &quot;Reviewed&quot; and save all
                outcome data. This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={handleCancelConfirmation}
                  disabled={isSubmitting}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-h-[44px] touch-manipulation"
                >
                  {isSubmitting && (
                    <Loader2 size="sm" className="mr-2 animate-spin" />
                  )}
                  {isSubmitting ? "Completing..." : "Complete Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
