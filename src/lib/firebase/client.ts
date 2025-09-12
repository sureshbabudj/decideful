import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(clientCredentials);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  // Only connect to emulators if not already connected
  try {
    // Check if auth emulator is already connected by trying to connect
    connectAuthEmulator(auth, "http://localhost:9099");
  } catch {
    console.log("Auth emulator already connected or not available");
  }

  try {
    // Check if Firestore emulator is already connected
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch {
    console.log("Firestore emulator already connected or not available");
  }
}
