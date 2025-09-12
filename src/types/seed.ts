import {
  Decision,
  Milestone,
  Notification,
  DecisionFormData,
  MilestoneFormData,
  OutcomeFormData,
  MilestoneUpdateData,
  DecisionDocument,
  MilestoneDocument,
  NotificationDocument,
} from "./index";

// Dummy Milestones
export const dummyMilestones: Milestone[] = [
  {
    id: "m1",
    description: "Complete online course",
    expectedDate: new Date("2025-10-01"),
    category: "skill",
    achieved: false,
    notes: "Start with basics.",
  },
  {
    id: "m2",
    description: "Save $1000",
    expectedDate: new Date("2025-11-15"),
    category: "money",
    achieved: true,
    notes: "Reached goal early.",
  },
];

// Dummy Decision
export const dummyDecision: Decision = {
  id: "d1",
  userId: "u1",
  title: "Switch Career to Tech",
  context: "Considering a move from finance to tech sector.",
  finalChoice: "Enroll in bootcamp",
  expectedOutcome: "Get a tech job in 6 months",
  reviewDate: new Date("2026-01-01"),
  status: "pending",
  milestones: dummyMilestones,
  actualOutcome: undefined,
  expectationCorrect: undefined,
  keyLearnings: undefined,
  createdAt: new Date("2025-09-01"),
  updatedAt: new Date("2025-09-10"),
};

// Dummy Notification
export const dummyNotification: Notification = {
  id: "n1",
  userId: "u1",
  decisionId: "d1",
  type: "milestone",
  message: "Milestone 'Complete online course' is overdue!",
  isRead: false,
  createdAt: new Date("2025-10-02"),
};

// Dummy DecisionFormData
export const dummyDecisionFormData: DecisionFormData = {
  title: "Switch Career to Tech",
  context: "Considering a move from finance to tech sector.",
  finalChoice: "Enroll in bootcamp",
  expectedOutcome: "Get a tech job in 6 months",
  reviewDate: new Date("2026-01-01"),
  milestones: [
    {
      description: "Complete online course",
      expectedDate: new Date("2025-10-01"),
      category: "skill",
    },
  ],
};

// Dummy MilestoneFormData
export const dummyMilestoneFormData: MilestoneFormData = {
  description: "Save $1000",
  expectedDate: new Date("2025-11-15"),
  category: "money",
};

// Dummy OutcomeFormData
export const dummyOutcomeFormData: OutcomeFormData = {
  actualOutcome: "Got a tech job in 5 months",
  expectationCorrect: true,
  keyLearnings: "Networking was key.",
  milestoneUpdates: [
    {
      id: "m1",
      achieved: true,
      notes: "Finished course.",
    },
  ],
};

// Dummy MilestoneUpdateData
export const dummyMilestoneUpdateData: MilestoneUpdateData = {
  id: "m2",
  achieved: true,
  notes: "Saved more than expected.",
};

// Dummy DecisionDocument
export const dummyDecisionDocument: DecisionDocument = {
  userId: "u1",
  title: "Switch Career to Tech",
  context: "Considering a move from finance to tech sector.",
  finalChoice: "Enroll in bootcamp",
  expectedOutcome: "Get a tech job in 6 months",
  reviewDate: "2026-01-01T00:00:00.000Z",
  status: "pending",
  milestones: [
    {
      description: "Complete online course",
      expectedDate: "2025-10-01T00:00:00.000Z",
      category: "skill",
      achieved: false,
      notes: "Start with basics.",
    },
  ],
  actualOutcome: undefined,
  expectationCorrect: undefined,
  keyLearnings: undefined,
  createdAt: "2025-09-01T00:00:00.000Z",
  updatedAt: "2025-09-10T00:00:00.000Z",
};

// Dummy MilestoneDocument
export const dummyMilestoneDocument: MilestoneDocument = {
  description: "Save $1000",
  expectedDate: "2025-11-15T00:00:00.000Z",
  category: "money",
  achieved: true,
  notes: "Reached goal early.",
};

// Dummy NotificationDocument
export const dummyNotificationDocument: NotificationDocument = {
  userId: "u1",
  decisionId: "d1",
  type: "review",
  message: "Time to review your decision!",
  isRead: false,
  createdAt: "2026-01-01T00:00:00.000Z",
};
