import { optionSchema } from "@/lib/schemas/decision.schema";
import z, { boolean } from "zod";

export interface Decision {
  id: string;
  userId: string;
  title: string;
  category: string;
  type: string;
  context: string;
  options: z.infer<typeof optionSchema>[];
  expectedOutcome: string;
  actualOutcome?: string;
  confidence: number;
  reviewDate: Date;
  reviewed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  reflection?: {
    actualOutcome: string;
    lessonsLearned: string;
    outcomeRating: number;
    wouldRepeat: boolean;
  };
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
