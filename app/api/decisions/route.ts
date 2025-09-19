import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/config";
import { decisionSchema } from "@/lib/schemas/decision.schema";
import { serverTimestamp } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { uid } = await adminAuth.verifyIdToken(token);

    const decisionsSnapshot = await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const decisions = decisionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(decisions);
  } catch (error) {
    console.error("Failed to fetch decisions:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { uid } = await adminAuth.verifyIdToken(token);

    const body = await request.json();
    const validatedData = decisionSchema.parse(body);

    const decisionData = {
      ...validatedData,
      userId: uid,
      confidence: validatedData.confidence || 50,
      reviewed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .add(decisionData);

    return NextResponse.json({
      id: docRef.id,
      ...decisionData,
    });
  } catch (error) {
    console.error("Failed to create decision:", error);
    return NextResponse.json(
      { error: "Failed to create decision" },
      { status: 500 }
    );
  }
}
