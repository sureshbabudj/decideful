"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Target, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { format, formatDate } from "date-fns";
import { Decision } from "@/types";

interface ProgressTimelineProps {
  decision: Decision;
}

export function ProgressTimeline({ decision }: ProgressTimelineProps) {
  const reflections = decision.reflections || [];
  // remove underscore from optionHistory
  const optionHistory = decision.reflections
    .map((r) => r.optionChanges)
    .filter((r) => r !== undefined)
    .map((r) => ({
      timestamp: r!.timestamp,
      options: r!.newOptions,
      reason: r!.reason,
    }));

  // Prepare data for charts
  const progressData = reflections.map((reflection, index) => ({
    date: format(reflection.reflectionDate, "MMM d"),
    reflectionNumber: index + 1,
    outcomeRating: reflection.outcomeRating,
    confidence: reflection.progressMetrics?.confidence || 0,
    skillLevel: reflection.progressMetrics?.skillLevel || 0,
    satisfaction: reflection.progressMetrics?.satisfaction || 0,
  }));

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return "stable";
    const first = data[0];
    const last = data[data.length - 1];
    const change = ((last - first) / first) * 100;

    if (change > 10) return "improving";
    if (change < -10) return "declining";
    return "stable";
  };

  const outcomeTrend = calculateTrend(progressData.map((d) => d.outcomeRating));
  const confidenceTrend = calculateTrend(progressData.map((d) => d.confidence));
  const skillTrend = calculateTrend(progressData.map((d) => d.skillLevel));

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <ArrowUp className="h-4 w-4" />;
      case "declining":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (reflections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reflections yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Add your first reflection to track progress
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Outcome Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {progressData[progressData.length - 1]?.outcomeRating || 0}/5
              </span>
              <div
                className={`flex items-center gap-1 ${getTrendColor(
                  outcomeTrend
                )}`}
              >
                {getTrendIcon(outcomeTrend)}
                <span className="text-sm capitalize">{outcomeTrend}</span>
              </div>
            </div>
            <Progress
              value={
                ((progressData[progressData.length - 1]?.outcomeRating || 0) /
                  5) *
                100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Confidence Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {progressData[progressData.length - 1]?.confidence || 0}%
              </span>
              <div
                className={`flex items-center gap-1 ${getTrendColor(
                  confidenceTrend
                )}`}
              >
                {getTrendIcon(confidenceTrend)}
                <span className="text-sm capitalize">{confidenceTrend}</span>
              </div>
            </div>
            <Progress
              value={progressData[progressData.length - 1]?.confidence || 0}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Skill Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {progressData[progressData.length - 1]?.skillLevel || 0}/10
              </span>
              <div
                className={`flex items-center gap-1 ${getTrendColor(
                  skillTrend
                )}`}
              >
                {getTrendIcon(skillTrend)}
                <span className="text-sm capitalize">{skillTrend}</span>
              </div>
            </div>
            <Progress
              value={
                ((progressData[progressData.length - 1]?.skillLevel || 0) /
                  10) *
                100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Outcome Rating Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="outcomeRating"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confidence & Skill Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Confidence %"
                />
                <Line
                  type="monotone"
                  dataKey="skillLevel"
                  stroke="#ffc658"
                  strokeWidth={2}
                  name="Skill Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Option Changes Timeline */}
      {optionHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Option Changes History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optionHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {format(history.timestamp, "MMM d, yyyy")}
                      </span>
                      {history.reason && (
                        <Badge variant="outline">{history.reason}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Options updated: {history.options.length} choices
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Reflections Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Reflections Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reflections.map((reflection, index) => (
              <div
                key={reflection.id}
                className="border-l-2 border-gray-200 pl-6 relative"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {index + 1}
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Reflection #{index + 1}</span>
                    <Badge variant="outline">
                      {formatDate(reflection.reflectionDate, "MMM d, yyyy")}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < reflection.outcomeRating
                              ? "bg-yellow-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Actual Outcome:
                    </span>
                    <p className="text-gray-600 mt-1">
                      {reflection.actualOutcome}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">
                      Lessons Learned:
                    </span>
                    <p className="text-gray-600 mt-1">
                      {reflection.lessonsLearned}
                    </p>
                  </div>

                  {reflection.nextSteps && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Next Steps:
                      </span>
                      <p className="text-gray-600 mt-1">
                        {reflection.nextSteps}
                      </p>
                    </div>
                  )}

                  {reflection.progressMetrics && (
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {reflection.progressMetrics.skillLevel}/10
                        </div>
                        <div className="text-xs text-gray-500">Skill Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {reflection.progressMetrics.confidence}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {reflection.progressMetrics.satisfaction}/5
                        </div>
                        <div className="text-xs text-gray-500">
                          Satisfaction
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
