import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";
import { getFirebaseConfig, isDevelopment } from "@/utils/env";

// Initialize Firebase lazily
let app: FirebaseApp | null = null;

const getApp = () => {
  if (!app) {
    const firebaseConfig = getFirebaseConfig();
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
};

// Initialize Firebase Auth lazily
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export const getAuthInstance = () => {
  if (!authInstance) {
    authInstance = getAuth(getApp());

    // Set persistence to local storage for session persistence
    if (typeof window !== "undefined") {
      setPersistence(authInstance, browserLocalPersistence).catch((error) => {
        console.warn("Failed to set auth persistence:", error);
      });
    }
  }
  return authInstance;
};

// Initialize Firestore lazily
export const getDbInstance = () => {
  if (!dbInstance) {
    dbInstance = getFirestore(getApp());
  }
  return dbInstance;
};

// Export for backward compatibility
export const auth = getAuthInstance();
export const db = getDbInstance();

// Connect to emulators in development
if (isDevelopment() && typeof window !== "undefined") {
  // Only connect to emulators if not already connected
  try {
    // Check if auth emulator is already connected by trying to connect
    connectAuthEmulator(getAuthInstance(), "http://localhost:9199");
  } catch {
    console.log("Auth emulator already connected or not available");
  }

  try {
    // Check if Firestore emulator is already connected
    connectFirestoreEmulator(getDbInstance(), "localhost", 8180);
  } catch {
    console.log("Firestore emulator already connected or not available");
  }
}

export default getApp;
