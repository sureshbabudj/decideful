import DecisionForm from "@/components/decisions/decision-form";

export default async function EditDecisionPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: decisionId } = await params;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground/90">
          Edit Your Decision
        </h1>
        <p className="text-foreground/60 mt-1">
          Update the details of your decision below to keep your decision-making
          process on track.
        </p>
      </div>

      <DecisionForm decisionId={decisionId} />
    </div>
  );
}
