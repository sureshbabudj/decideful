export interface Milestone {
  id: string;
  description: string;
  expectedDate: Date;
  category: MilestoneCategory;
  achieved?: boolean;
  notes?: string;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  context: string;
  finalChoice: string;
  expectedOutcome: string;
  reviewDate: Date;
  status: DecisionStatus;
  milestones: Milestone[];
  actualOutcome?: string;
  expectationCorrect?: boolean;
  keyLearnings?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  decisionId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Enums and constants
export type MilestoneCategory =
  | "skill"
  | "money"
  | "network"
  | "familiarity"
  | "other";

export type DecisionStatus = "pending" | "reviewed";

export type NotificationType = "milestone" | "review";

// Form data types for creating/editing decisions
export interface DecisionFormData {
  title: string;
  context: string;
  finalChoice: string;
  expectedOutcome: string;
  reviewDate: Date;
  milestones: MilestoneFormData[];
}

export interface MilestoneFormData {
  description: string;
  expectedDate: Date;
  category: MilestoneCategory;
}

// Outcome review form data
export interface OutcomeFormData {
  actualOutcome: string;
  expectationCorrect: boolean;
  keyLearnings: string;
  milestoneUpdates: MilestoneUpdateData[];
}

export interface MilestoneUpdateData {
  id: string;
  achieved: boolean;
  notes?: string;
}

// Firestore document types (for database operations)
export interface DecisionDocument
  extends Omit<
    Decision,
    "id" | "createdAt" | "updatedAt" | "reviewDate" | "milestones"
  > {
  reviewDate: string; // Firestore timestamp as string
  milestones: MilestoneDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneDocument
  extends Omit<Milestone, "id" | "expectedDate"> {
  expectedDate: string; // Firestore timestamp as string
}

export interface NotificationDocument
  extends Omit<Notification, "id" | "createdAt"> {
  createdAt: string; // Firestore timestamp as string
}

export * from "./api";
