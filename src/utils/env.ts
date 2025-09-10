// Environment variable validation and helpers

export const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export const validateEnvironment = (): {
  isValid: boolean;
  missing: string[];
} => {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

export const getFirebaseConfig = () => {
  // In development, environment variables might not be loaded yet during module evaluation
  // Only validate and warn if we're in a browser context or server-side rendering
  if (typeof window !== "undefined" || process.env.NODE_ENV === "production") {
    const validation = validateEnvironment();

    if (!validation.isValid) {
      console.warn(
        "Missing Firebase environment variables:",
        validation.missing
      );
      console.warn(
        "Please check your .env.local file and ensure all required variables are set."
      );
    }
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};
