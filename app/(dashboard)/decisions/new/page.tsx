import DecisionForm from "@/components/decisions/decision-form";

export default async function NewDecisionPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { type, template } = await searchParams;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground/90">
          Create New Decision
        </h1>
        <p className="text-foreground/60 mt-1">
          Fill in the details below to start tracking your decision-making
          process.
        </p>
      </div>

      <DecisionForm
        type={Array.isArray(type) ? type[0] : type}
        template={Array.isArray(template) ? template[0] : template}
      />
    </div>
  );
}
