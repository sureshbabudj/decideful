import { z } from "zod";
import { MilestoneCategory } from "@/types";

// Milestone category schema
const milestoneCategories: [MilestoneCategory, ...MilestoneCategory[]] = [
  "skill",
  "money",
  "network",
  "familiarity",
  "other",
];

// Milestone form validation schema (for form inputs - keeps dates as strings)
export const milestoneFormSchema = z.object({
  description: z
    .string()
    .min(1, "Milestone description is required")
    .max(200, "Description must be less than 200 characters"),
  expectedDate: z
    .string()
    .min(1, "Expected date is required")
    .refine(
      (str) => {
        const date = new Date(str);
        return !isNaN(date.getTime());
      },
      {
        message: "Please enter a valid date",
      }
    )
    .refine(
      (str) => {
        const date = new Date(str);
        return date > new Date();
      },
      {
        message: "Expected date must be in the future",
      }
    ),
  category: z.enum(milestoneCategories, {
    message: "Please select a milestone category",
  }),
});

// Decision form validation schema (for form inputs - keeps dates as strings)
export const decisionFormSchema = z.object({
  title: z
    .string()
    .min(1, "Decision title is required")
    .max(100, "Title must be less than 100 characters"),
  context: z
    .string()
    .min(1, "Context is required")
    .max(1000, "Context must be less than 1000 characters"),
  finalChoice: z
    .string()
    .min(1, "Final choice is required")
    .max(200, "Final choice must be less than 200 characters"),
  expectedOutcome: z
    .string()
    .min(1, "Expected outcome is required")
    .max(1000, "Expected outcome must be less than 1000 characters"),
  reviewDate: z
    .string()
    .min(1, "Review date is required")
    .refine(
      (str) => {
        const date = new Date(str);
        return !isNaN(date.getTime());
      },
      {
        message: "Please enter a valid date",
      }
    )
    .refine(
      (str) => {
        const date = new Date(str);
        return date > new Date();
      },
      {
        message: "Review date must be in the future",
      }
    ),
  milestones: z
    .array(milestoneFormSchema)
    .min(1, "At least one milestone is required")
    .max(10, "Maximum 10 milestones allowed"),
});

// Outcome form validation schema
export const outcomeFormSchema = z.object({
  actualOutcome: z
    .string()
    .min(1, "Actual outcome is required")
    .max(1000, "Actual outcome must be less than 1000 characters"),
  expectationCorrect: z.boolean({
    message: "Please indicate if your expectation was correct",
  }),
  keyLearnings: z
    .string()
    .min(1, "Key learnings are required")
    .max(1000, "Key learnings must be less than 1000 characters"),
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

// Authentication form schemas
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    displayName: z
      .string()
      .max(50, "Display name must be less than 50 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type inference from schemas
export type DecisionFormData = z.infer<typeof decisionFormSchema>;
export type MilestoneFormData = z.infer<typeof milestoneFormSchema>;
export type OutcomeFormData = z.infer<typeof outcomeFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
