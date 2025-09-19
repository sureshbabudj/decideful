import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/config";
import { serverTimestamp } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { uid } = await adminAuth.verifyIdToken(token);

    const decisionDoc = await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .doc(params.id)
      .get();

    if (!decisionDoc.exists || decisionDoc.data()?.userId !== uid) {
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: decisionDoc.id,
      ...decisionDoc.data(),
    });
  } catch (error) {
    console.error("Failed to fetch decision:", error);
    return NextResponse.json(
      { error: "Failed to fetch decision" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { uid } = await adminAuth.verifyIdToken(token);

    const body = await request.json();

    // Verify the decision belongs to the user
    const decisionDoc = await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .doc(params.id)
      .get();

    if (!decisionDoc.exists || decisionDoc.data()?.userId !== uid) {
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );
    }

    // Update the decision
    await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .doc(params.id)
      .update({
        ...body,
        updatedAt: serverTimestamp(),
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update decision:", error);
    return NextResponse.json(
      { error: "Failed to update decision" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { uid } = await adminAuth.verifyIdToken(token);

    // Verify the decision belongs to the user
    const decisionDoc = await adminDb
      .collection(COLLECTIONS.DECISIONS)
      .doc(params.id)
      .get();

    if (!decisionDoc.exists || decisionDoc.data()?.userId !== uid) {
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );
    }

    // Delete the decision
    await adminDb.collection(COLLECTIONS.DECISIONS).doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete decision:", error);
    return NextResponse.json(
      { error: "Failed to delete decision" },
      { status: 500 }
    );
  }
}
