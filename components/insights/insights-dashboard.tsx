"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";

interface InsightsDashboardProps {
  insights: {
    total: number;
    reviewed: number;
    accuracy: number;
    categories: Record<string, number>;
    avgConfidence: number;
    reviewRate: number;
  };
}

export function InsightsDashboard({ insights }: InsightsDashboardProps) {
  const categoryData = Object.entries(insights.categories).map(
    ([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / insights.total) * 100),
    })
  );

  const getTrendIcon = (value: number) => {
    return value >= 70 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Decision Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="capitalize">
                    {category.name}
                  </Badge>
                  <span className="text-sm font-medium">
                    {category.count} decisions
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <p className="text-xs text-foreground/60">
                  {category.percentage}% of total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Review Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{insights.reviewRate}%</span>
                  {getTrendIcon(insights.reviewRate)}
                </div>
              </div>
              <Progress value={insights.reviewRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Decision Accuracy</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{insights.accuracy}%</span>
                  {getTrendIcon(insights.accuracy)}
                </div>
              </div>
              <Progress value={insights.accuracy} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Confidence</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{insights.avgConfidence}%</span>
                  {getTrendIcon(insights.avgConfidence)}
                </div>
              </div>
              <Progress value={insights.avgConfidence} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.reviewRate < 70 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">
                  Improve Review Rate
                </h4>
                <p className="text-sm text-yellow-700">
                  You&apos;re reviewing {insights.reviewRate}% of your
                  decisions. Try setting more frequent review reminders to
                  improve your learning.
                </p>
              </div>
            )}

            {insights.accuracy < 60 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-1">
                  Focus on Decision Quality
                </h4>
                <p className="text-sm text-red-700">
                  Your accuracy rate is {insights.accuracy}%. Consider spending
                  more time on the analysis phase before making decisions.
                </p>
              </div>
            )}

            {insights.avgConfidence > 80 && insights.accuracy < 70 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">
                  Confidence Calibration
                </h4>
                <p className="text-sm text-blue-700">
                  You&apos;re very confident in your decisions but your accuracy
                  is {insights.accuracy}%. Double-check your assumptions and
                  gather more data to improve accuracy.
                </p>
              </div>
            )}

            {insights.total < 10 && (
              <div className="p-4 bg-background/5 border border-border/80 rounded-lg">
                <h4 className="font-medium text-foreground/80 mb-1">
                  Start Tracking More Decisions
                </h4>
                <p className="text-sm text-foreground/70">
                  You&apos;ve made only {insights.total} decisions so far. The
                  more decisions you track, the better insights you&apos;ll get.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
