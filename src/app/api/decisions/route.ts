import { adminDb } from "@/lib/firebase/admin";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { text } = await req.json();
  const ref = await adminDb
    .collection("users")
    .doc(user.uid)
    .collection("decisions")
    .add({ text, done: false, createdAt: new Date().toISOString() });

  return Response.json({ id: ref.id });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  await adminDb
    .collection("users")
    .doc(user.uid)
    .collection("decisions")
    .doc(id)
    .delete();

  return new Response(null, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const payload = await req.json();
  const todoUpdateSchema = z.object({
    id: z.string(),
    text: z.string().optional(),
    done: z.boolean().optional(),
  });

  const { id, text, done } = todoUpdateSchema.parse(payload);

  const ref = adminDb
    .collection("users")
    .doc(user.uid)
    .collection("decisions")
    .doc(id);

  // fetch once to be sure it exists + belongs to user
  const snap = await ref.get();
  if (!snap.exists) return new Response("Not found", { status: 404 });

  const update: Record<string, unknown> = {};
  if (text !== undefined) update.text = text;
  if (done !== undefined) update.done = done;
  update.updatedAt = new Date().toISOString();

  await ref.update(update);
  return Response.json({ ok: true });
}
