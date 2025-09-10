import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Decision,
  DecisionDocument,
  Milestone,
  Notification,
  NotificationDocument,
  ServiceResult,
} from "@/types";

// Generic function to handle Firestore operations
const handleFirestoreOperation = async <T>(
  operation: () => Promise<T>
): Promise<ServiceResult<T>> => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error("Firestore operation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

// Decision operations
export const createDecision = async (
  decision: Omit<Decision, "id">
): Promise<ServiceResult<string>> => {
  return handleFirestoreOperation(async () => {
    const docRef = await addDoc(
      collection(db, "users", decision.userId, "decisions"),
      decision
    );
    return docRef.id;
  });
};

export const updateDecision = async (
  userId: string,
  decisionId: string,
  updates: Partial<Decision>
): Promise<ServiceResult<void>> => {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, "users", userId, "decisions", decisionId);

    // Filter out undefined values to prevent Firestore errors
    const cleanUpdates: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    const updateData: any = {
      ...cleanUpdates,
      updatedAt: new Date().toISOString(),
    };

    // Transform dates to strings if present
    if (updates.reviewDate) {
      updateData.reviewDate = updates.reviewDate.toISOString();
    }
    if (updates.milestones) {
      updateData.milestones = updates.milestones.map((milestone) => ({
        ...milestone,
        expectedDate: milestone.expectedDate.toISOString(),
      }));
    }

    await updateDoc(docRef, updateData);
  });
};

// Specialized function for updating decision with outcome data
export const updateDecisionOutcome = async (
  userId: string,
  decisionId: string,
  outcomeData: {
    actualOutcome: string;
    expectationCorrect: boolean;
    keyLearnings: string;
    milestones: Milestone[];
  }
): Promise<ServiceResult<void>> => {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, "users", userId, "decisions", decisionId);
    const updateData = {
      actualOutcome: outcomeData.actualOutcome,
      expectationCorrect: outcomeData.expectationCorrect,
      keyLearnings: outcomeData.keyLearnings,
      milestones: outcomeData.milestones.map((milestone) => ({
        ...milestone,
        expectedDate: milestone.expectedDate.toISOString(),
      })),
      status: "reviewed",
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updateData);
  });
};

export const deleteDecision = async (
  userId: string,
  decisionId: string
): Promise<ServiceResult<void>> => {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, "users", userId, "decisions", decisionId);
    await deleteDoc(docRef);
  });
};

export const getDecision = async (
  userId: string,
  decisionId: string
): Promise<ServiceResult<Decision | null>> => {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, "users", userId, "decisions", decisionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return transformDocumentToDecision(
        docSnap.id,
        docSnap.data() as DecisionDocument
      );
    }
    return null;
  });
};

export const getUserDecisions = async (
  userId: string,
  options?: {
    status?: "pending" | "reviewed";
    limit?: number;
    orderBy?: "createdAt" | "reviewDate";
    orderDirection?: "asc" | "desc";
  }
): Promise<ServiceResult<Decision[]>> => {
  return handleFirestoreOperation(async () => {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)];

    if (options?.status) {
      constraints.push(where("status", "==", options.status));
    }

    if (options?.orderBy) {
      constraints.push(
        orderBy(options.orderBy, options.orderDirection || "desc")
      );
    } else {
      constraints.push(orderBy("createdAt", "desc"));
    }

    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(
      collection(db, "users", userId, "decisions"),
      ...constraints
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) =>
      transformDocumentToDecision(doc.id, doc.data() as DecisionDocument)
    );
  });
};

// Real-time listener for user decisions
export const subscribeToUserDecisions = (
  userId: string,
  callback: (decisions: Decision[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, "users", userId, "decisions"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const decisions = querySnapshot.docs.map((doc) =>
        transformDocumentToDecision(doc.id, doc.data() as DecisionDocument)
      );
      callback(decisions);
    },
    (error) => {
      console.error("Error listening to decisions:", error);
      if (onError) {
        onError(error);
      }
    }
  );
};

// Notification operations
export const createNotification = async (
  notification: Omit<Notification, "id">
): Promise<ServiceResult<string>> => {
  return handleFirestoreOperation(async () => {
    const notificationDoc = transformNotificationToDocument(notification);
    const docRef = await addDoc(
      collection(db, "notifications"),
      notificationDoc
    );
    return docRef.id;
  });
};

export const getUserNotifications = async (
  userId: string,
  unreadOnly: boolean = false
): Promise<ServiceResult<Notification[]>> => {
  return handleFirestoreOperation(async () => {
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ];

    if (unreadOnly) {
      constraints.push(where("isRead", "==", false));
    }

    const q = query(collection(db, "notifications"), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) =>
      transformDocumentToNotification(
        doc.id,
        doc.data() as NotificationDocument
      )
    );
  });
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<ServiceResult<void>> => {
  return handleFirestoreOperation(async () => {
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, { isRead: true });
  });
};

// Utility function to check if Firestore is available
export const isFirestoreAvailable = (): boolean => {
  try {
    return !!db;
  } catch {
    return false;
  }
};
