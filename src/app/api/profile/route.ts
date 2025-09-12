import { requireAuth } from "@/lib/auth/server";
import { adminAuth } from "@/lib/firebase/admin";
import { z } from "zod";

const schema = z.object({ displayName: z.string().min(1).optional() });

export async function PUT(req: Request) {
  const user = await requireAuth();
  const { displayName } = schema.parse(await req.json());
  await adminAuth.updateUser(user.uid, { displayName });
  return Response.json({ ok: true });
}
