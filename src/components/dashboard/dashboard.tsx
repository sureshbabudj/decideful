"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Decision } from "@/types";

export const Dashboard = ({ decisions }: { decisions: Decision[] }) => {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Decision Dashboard
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Track your decisions and their outcomes
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
