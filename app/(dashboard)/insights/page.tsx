"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { InsightsDashboard } from "@/components/insights/insights-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { Decision } from "@/types";

export default function InsightsPage() {
  const { user } = useAuthStore();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchInsights = async () => {
      try {
        const q = query(
          collection(db, "decisions"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const decisions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Decision[];

        // Calculate insights
        const total = decisions.length;
        const reviewed = decisions.filter((d) => d.reviewed).length;
        const accuracy = decisions.filter(
          (d) =>
            d.reviewed &&
            d.reflection?.outcomeRating &&
            d.reflection.outcomeRating >= 4
        ).length;

        // Category breakdown
        const categories = decisions.reduce((acc: any, decision) => {
          acc[decision.category] = (acc[decision.category] || 0) + 1;
          return acc;
        }, {});

        // Confidence trends
        const avgConfidence =
          decisions.reduce((sum, d) => sum + (d.confidence || 0), 0) / total;

        setInsights({
          total,
          reviewed,
          accuracy:
            total > 0 && accuracy > 0
              ? Math.round((accuracy / reviewed) * 100)
              : 0,
          categories,
          avgConfidence: isNaN(Math.round(avgConfidence))
            ? 0
            : Math.round(avgConfidence),
          reviewRate: total > 0 ? Math.round((reviewed / total) * 100) : 0,
        });
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading insights...</div>;
  }

  if (!insights) {
    return <div className="text-center p-8">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground/90">
          Insights Dashboard
        </h1>
        <p className="text-foreground/60 mt-1">
          Analyze your decision-making patterns and improve your accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Decisions
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.reviewed}</div>
            <p className="text-xs text-muted-foreground">
              {insights.reviewRate}% review rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.accuracy}%</div>
            <p className="text-xs text-muted-foreground">High-rated outcomes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Confidence
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.avgConfidence}%</div>
          </CardContent>
        </Card>
      </div>

      <InsightsDashboard insights={insights} />
    </div>
  );
}
