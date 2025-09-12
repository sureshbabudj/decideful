import { z } from "zod";

export const milestoneCategorySchema = z.enum([
  "skill",
  "money",
  "network",
  "familiarity",
  "other",
]);

export const decisionStatusSchema = z.enum(["pending", "reviewed"]);
export const notificationTypeSchema = z.enum(["milestone", "review"]);

export const milestoneSchema = z.object({
  id: z.string(),
  description: z.string(),
  expectedDate: z.date(),
  category: milestoneCategorySchema,
  achieved: z.boolean().optional(),
  notes: z.string().optional(),
});

export const decisionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  context: z.string(),
  finalChoice: z.string(),
  expectedOutcome: z.string(),
  reviewDate: z.date(),
  status: decisionStatusSchema,
  milestones: z.array(milestoneSchema),
  actualOutcome: z.string().optional(),
  expectationCorrect: z.boolean().optional(),
  keyLearnings: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  decisionId: z.string(),
  type: notificationTypeSchema,
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
});

export const decisionFormDataSchema = z.object({
  title: z.string(),
  context: z.string(),
  finalChoice: z.string(),
  expectedOutcome: z.string(),
  reviewDate: z.date(),
  milestones: z.array(
    z.object({
      description: z.string(),
      expectedDate: z.date(),
      category: milestoneCategorySchema,
    })
  ),
});

export const milestoneFormDataSchema = z.object({
  description: z.string(),
  expectedDate: z.date(),
  category: milestoneCategorySchema,
});

export const outcomeFormDataSchema = z.object({
  actualOutcome: z.string(),
  expectationCorrect: z.boolean(),
  keyLearnings: z.string(),
  milestoneUpdates: z.array(
    z.object({
      id: z.string(),
      achieved: z.boolean(),
      notes: z.string().optional(),
    })
  ),
});

export const milestoneUpdateDataSchema = z.object({
  id: z.string(),
  achieved: z.boolean(),
  notes: z.string().optional(),
});

export const decisionDocumentSchema = decisionSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    reviewDate: true,
    milestones: true,
  })
  .extend({
    reviewDate: z.string(),
    milestones: z.array(
      milestoneSchema
        .omit({ id: true, expectedDate: true })
        .extend({ expectedDate: z.string() })
    ),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export const milestoneDocumentSchema = milestoneSchema
  .omit({ id: true, expectedDate: true })
  .extend({ expectedDate: z.string() });

export const notificationDocumentSchema = notificationSchema
  .omit({ id: true, createdAt: true })
  .extend({ createdAt: z.string() });
