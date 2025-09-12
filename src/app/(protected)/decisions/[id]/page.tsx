import { DecisionDetail } from "@/components/decisions/decision-detail";
import { getAuthenticatedUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";
import { snapToTyped } from "@/lib/firebase/utils";
import { decisionSchema } from "@/types/transformSchema";
import { redirect } from "next/navigation";

export default async function DecisionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthenticatedUser();
  if (!user) return redirect("/login");
  const { id } = await params;

  const snap = await adminDb
    .collection("users")
    .doc(user.uid)
    .collection("decisions")
    .doc(id)
    .get();

  const data = snap.data();
  if (!data) {
    return <div>Decision not found</div>;
  }

  const decision = snapToTyped({ id, data: () => data }, decisionSchema);

  return <DecisionDetail decision={decision} />;
}
