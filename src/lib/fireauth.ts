import { cookies } from "next/headers";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// IMPORTANT: Ensure your FIREBASE_ADMIN_CREDENTIALS environment variable is set.
// It should contain the JSON content of your service account key file.
const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_CREDENTIALS as string
);

// Initialize the Firebase Admin SDK once.
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

/**
 * Gets the authenticated user from the session cookie.
 * It's designed to work with both production and emulator environments.
 */
export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;
  let currentUser = null;

  if (authIdToken) {
    const auth = getAuth();
    try {
      let decodedToken;
      // Check if we are running in the emulator environment
      if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        // For the emulator, we use a fixed UID to ensure the getUser call
        // always succeeds and retrieves a real user, bypassing the need
        // to verify an unsigned token.
        console.log("Using Firebase Auth Emulator host.");
        console.log(
          "FIREBASE_AUTH_EMULATOR_HOST is:",
          process.env.FIREBASE_AUTH_EMULATOR_HOST
        );
        decodedToken = {
          uid: "emulator-uid", // A fixed, valid UID for testing
        };
      } else {
        // In a production environment, use the proper verification.
        decodedToken = await auth.verifyIdToken(authIdToken);
      }

      // Get the user from the Firebase Auth service. This works for both
      // production and the emulator as long as a user with the UID exists.
      currentUser = await auth.getUser(decodedToken.uid);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      currentUser = null;
    }
  }

  return { currentUser };
}

// import { cookies } from "next/headers";
// import { getAuth } from "firebase/auth";
// import { initializeServerApp, initializeApp } from "firebase/app";

// import type { User } from "firebase/auth";

// export async function getAuthenticatedAppForUser(): Promise<{
//   currentUser: User | null;
//   firebaseServerApp: ReturnType<typeof initializeApp> | null;
// }> {
//   try {
//     const authIdToken = (await cookies()).get("__session")?.value;

//     if (authIdToken) {
//       const firebaseServerApp = initializeServerApp(
//         initializeApp({
//           apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//           authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//           projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//           appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//           storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//           messagingSenderId:
//             process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//         }),
//         {
//           authIdToken,
//         }
//       );
//       const auth = getAuth(firebaseServerApp);
//       await auth.authStateReady();
//       return { firebaseServerApp, currentUser: auth.currentUser };
//     }
//     return { currentUser: null, firebaseServerApp: null };
//   } catch (error) {
//     console.error("Error in getAuthenticatedAppForUser:", error);
//     return { currentUser: null, firebaseServerApp: null };
//   }
// }
