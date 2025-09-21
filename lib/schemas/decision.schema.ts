import { z } from "zod";

export const decisionTypeEnum = z.enum(["quick", "detailed", "complex"]);
export const categoryEnum = z.enum([
  "work",
  "personal",
  "finance",
  "health",
  "relationships",
  "other",
]);
export const reviewFrequencyEnum = z.enum([
  "1 week",
  "2 weeks",
  "1 month",
  "3 months",
  "6 months",
  "custom",
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "10 years",
]);

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text is required"),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  selected: z.boolean(),
});

export const decisionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: categoryEnum,
  type: decisionTypeEnum,
  context: z.string().min(10, "Context must be at least 10 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  expectedOutcome: z
    .string()
    .min(10, "Expected outcome must be at least 10 characters"),
  reviewReminder: reviewFrequencyEnum,
  confidence: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export const optionChangeSchema = z.object({
  changeDate: z.date(),
  reason: z.string().optional(),
  newOptions: z.array(optionSchema).min(2, "At least 2 options are required"),
});

export const reflectionSchema = z.object({
  actualOutcome: z
    .string()
    .min(10, "Actual outcome must be at least 10 characters"),
  lessonsLearned: z
    .string()
    .min(10, "Lessons learned must be at least 10 characters"),
  outcomeRating: z.number().min(1).max(5),
  wouldRepeat: z.boolean(),
  accuracy: z.number().min(0).max(100).default(0).optional(),
  optionChanges: optionChangeSchema.optional(),
  progressMetrics: z
    .object({
      skillLevel: z.number().min(1).max(10).default(1).optional(),
      confidence: z.number().min(0).max(100).default(0).optional(),
      satisfaction: z.number().min(1).max(5).default(1).optional(),
    })
    .optional(),
  nextSteps: z.string().default("").optional(),
});

export const reflectionUpdateSchema = z.object({
  reflectionId: z.string(),
  decisionId: z.string(),
  userId: z.string(),
  ...reflectionSchema.shape,
  reflectionNumber: z.number(), // Track which reflection this is (1st, 2nd, etc.)
  reflectionDate: z.date(),
});

export type DecisionInput = z.infer<typeof decisionSchema>;
export type ReflectionInput = z.infer<typeof reflectionSchema>;
export type ReflectionUpdateInput = z.infer<typeof reflectionUpdateSchema>;
export type OptionChangeInput = z.infer<typeof optionChangeSchema>;
export type DecisionType = z.infer<typeof decisionTypeEnum>;
export type CategoryType = z.infer<typeof categoryEnum>;
export type ReviewFrequencyType = z.infer<typeof reviewFrequencyEnum>;
export type OptionType = z.infer<typeof optionSchema>;
