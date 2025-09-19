import {
  GoogleAuthProvider,
  OAuthCredential,
  signInWithPopup,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import { RegisterInput } from "../schemas/auth.schema";
import { CategoryType, ReviewFrequencyType } from "../schemas/decision.schema";

export async function signInGoogle(): Promise<OAuthCredential | null> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return GoogleAuthProvider.credentialFromResult(cred);
}

export async function initializeUserDocument(
  user: User,
  {
    name,
    email,
    categories = ["personal"],
    reviewFrequency = "1 month",
  }: Omit<RegisterInput, "password" | "confirmPassword"> & {
    categories?: CategoryType[];
    reviewFrequency?: ReviewFrequencyType;
  }
) {
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
    preferences: {
      categories,
      reviewFrequency,
    },
    settings: {
      notificationSettings: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
      },
      reminderSettings: {
        reviewReminders: true,
        milestoneAlerts: true,
      },
      privacySettings: {
        profileVisibility: true,
        shareAnalytics: false,
        personalizedAds: false,
      },
      language: "en",
      theme: "system",
      timezone: "UTC",
    },
  });
}
