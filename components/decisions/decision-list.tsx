"use client";

import { DecisionCard } from "./decision-card";

interface Decision {
  id: string;
  title: string;
  category: string;
  type: string;
  confidence: number;
  reviewDate: Date;
  reviewed: boolean;
  createdAt: Date;
}

interface DecisionListProps {
  decisions: Decision[];
}

export function DecisionList({ decisions }: DecisionListProps) {
  if (decisions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-foreground/50">
          <p className="text-lg font-medium mb-2">No decisions yet</p>
          <p className="text-sm">
            Start tracking your decisions to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} />
      ))}
    </div>
  );
}
