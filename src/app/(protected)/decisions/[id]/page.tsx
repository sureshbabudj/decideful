import { DecisionDetail } from "@/components/decisions/decision-detail";
import { getAuthenticatedAppForUser } from "@/lib/fireauth";

export default async function DecisionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { currentUser } = await getAuthenticatedAppForUser();

  return (
    <>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      <DecisionDetail decisionId={id} />
    </>
  );
}
