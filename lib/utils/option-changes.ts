import {
  OptionType,
  OptionChangeInput,
  ReflectionInput,
} from "@/lib/schemas/decision.schema";
import { Decision } from "@/types";

/**
 * Utility functions for option change management
 */

/**
 * Gets the current options for a decision, considering any previous option changes
 * @param decision - The original decision
 * @param reflections - Array of reflections for this decision (sorted by date)
 * @returns The most current options
 */
export function getCurrentOptions(
  decision: Decision,
  reflections?: ReflectionInput[]
): OptionType[] {
  if (!reflections || reflections.length === 0) {
    return decision.options;
  }

  // Find the most recent reflection with option changes
  for (let i = reflections.length - 1; i >= 0; i--) {
    const reflection = reflections[i];
    if (reflection.optionChanges && reflection.optionChanges.length > 0) {
      // Get the most recent option change
      const lastChange =
        reflection.optionChanges[reflection.optionChanges.length - 1];
      return lastChange.newOptions;
    }
  }

  // No option changes found, return original options
  return decision.options;
}

/**
 * Checks if there are any meaningful changes between two option sets
 * @param previousOptions - The previous options
 * @param newOptions - The new options
 * @returns True if there are changes
 */
export function hasOptionChanges(
  previousOptions: OptionType[],
  newOptions: OptionType[]
): boolean {
  // Quick check for different lengths
  if (previousOptions.length !== newOptions.length) {
    return true;
  }

  // Deep comparison of options
  return JSON.stringify(previousOptions) !== JSON.stringify(newOptions);
}

/**
 * Creates a summary of what changed in an option change
 * @param optionChange - The option change data
 * @returns Human-readable summary
 */
export function getOptionChangeSummary(
  optionChange: OptionChangeInput
): string {
  const { previousOptions, newOptions, reason } = optionChange;

  const summaryParts: string[] = [];

  // Check for selection changes
  const prevSelected = previousOptions
    .filter((opt) => opt.selected)
    .map((opt) => opt.text);
  const newSelected = newOptions
    .filter((opt) => opt.selected)
    .map((opt) => opt.text);

  if (JSON.stringify(prevSelected) !== JSON.stringify(newSelected)) {
    summaryParts.push(
      `Selection changed from [${prevSelected.join(
        ", "
      )}] to [${newSelected.join(", ")}]`
    );
  }

  // Check for new options
  const newOptionTexts = newOptions
    .filter(
      (newOpt) => !previousOptions.some((prevOpt) => prevOpt.id === newOpt.id)
    )
    .map((opt) => opt.text);

  if (newOptionTexts.length > 0) {
    summaryParts.push(`Added options: ${newOptionTexts.join(", ")}`);
  }

  // Check for removed options
  const removedOptions = previousOptions
    .filter((prevOpt) => !newOptions.some((newOpt) => newOpt.id === prevOpt.id))
    .map((opt) => opt.text);

  if (removedOptions.length > 0) {
    summaryParts.push(`Removed options: ${removedOptions.join(", ")}`);
  }

  // Check for text changes
  const textChanges = newOptions.filter((newOpt) => {
    const prevOpt = previousOptions.find((prevOpt) => prevOpt.id === newOpt.id);
    return prevOpt && prevOpt.text !== newOpt.text;
  });

  if (textChanges.length > 0) {
    summaryParts.push(`Modified ${textChanges.length} option(s)`);
  }

  // Add reason if provided
  if (reason && reason.trim()) {
    summaryParts.push(`Reason: ${reason}`);
  }

  return summaryParts.length > 0
    ? summaryParts.join("; ")
    : "No significant changes detected";
}

/**
 * Validates option change data
 * @param optionChange - The option change to validate
 * @returns Validation result with any errors
 */
export function validateOptionChange(optionChange: OptionChangeInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check minimum options
  if (optionChange.newOptions.length < 2) {
    errors.push("At least 2 options are required");
  }

  // Check for empty option text
  const emptyOptions = optionChange.newOptions.filter(
    (opt) => !opt.text.trim()
  );
  if (emptyOptions.length > 0) {
    errors.push("All options must have text");
  }

  // Check if any changes were made
  if (
    !hasOptionChanges(optionChange.previousOptions, optionChange.newOptions) &&
    (!optionChange.reason || !optionChange.reason.trim())
  ) {
    errors.push("No changes detected - modify options or provide a reason");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formats an option change for display in a timeline or history
 * @param optionChange - The option change data
 * @param index - The index in the changes array (for numbering)
 * @returns Formatted display object
 */
export function formatOptionChangeForDisplay(
  optionChange: OptionChangeInput,
  index: number = 0
) {
  return {
    id: `change-${index}`,
    date: optionChange.changeDate,
    title: `Option Change #${index + 1}`,
    summary: getOptionChangeSummary(optionChange),
    reason: optionChange.reason || "No reason provided",
    previousOptions: optionChange.previousOptions,
    newOptions: optionChange.newOptions,
  };
}
