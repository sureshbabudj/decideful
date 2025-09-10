import { Dashboard } from "@/components/dashboard/dashboard";
import { Decision } from "@/types";

export default function DashboardPage() {
  const decisions: Decision[] = [];

  return (
    <div className="max-w-5xl mx-auto" data-testid="dashboard-page">
      <Dashboard decisions={decisions} />
    </div>
  );
}
