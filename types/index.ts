import { OptionType } from "@/lib/schemas/decision.schema";

export interface Reflection {
  id: string;
  decisionId: string;
  userId: string;
  reflectionNumber: number;
  actualOutcome: string;
  lessonsLearned: string;
  outcomeRating: number;
  wouldRepeat: boolean;
  accuracy?: number;
  optionChanges?: {
    newOptions: OptionType[];
    reason?: string;
    timestamp: Date;
  };
  progressMetrics?: {
    skillLevel?: number;
    confidence?: number;
    satisfaction?: number;
  };
  nextSteps?: string;
  reflectionDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  category: string;
  type: string;
  context: string;
  options: OptionType[];
  expectedOutcome: string;
  actualOutcome?: string;
  confidence?: number;
  reviewDate: Date;
  reviewed: boolean;
  reflections: Reflection[];
  currentReflectionCount: number;
  lastReflectionDate?: Date;
  optionHistory: Array<{
    timestamp: Date;
    options: OptionType[];
    reason?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  categories: string[];
  reviewFrequency: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface ReminderSettings {
  reviewReminders: boolean;
  milestoneAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: boolean;
  shareAnalytics: boolean;
  personalizedAds: boolean;
}

export interface UserSettings {
  notificationSettings: NotificationSettings;
  reminderSettings: ReminderSettings;
  privacySettings: PrivacySettings;
  language: string;
  timezone: string;
  theme: string;
}

export interface AppUserProfile {
  name: string;
  email: string;
  createdAt: Date;
  decisionCount: number;
  preferences: UserPreferences;
  settings: UserSettings;
}
