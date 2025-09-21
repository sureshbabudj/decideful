"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { CheckCircle, Circle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Decision } from "@/types";
import { OptionType } from "@/lib/schemas/decision.schema";

interface AggregatedOption {
  id: string;
  text: string;
  selected: boolean;
  status: "initial" | "new" | "deleted" | "current";
  createdDate?: Date;
  deletedDate?: Date;
  pros?: string[];
  cons?: string[];
}

interface AggregatedOptionsProps {
  decision: Decision;
  showTimestamps?: boolean;
  showProsCons?: boolean;
  className?: string;
}

export function AggregatedOptions({
  decision,
  showTimestamps = true,
  showProsCons = false,
  className = "",
}: AggregatedOptionsProps) {
  const aggregatedOptions = useMemo(() => {
    const optionMap = new Map<string, AggregatedOption>();
    const optionHistory: Array<{
      options: OptionType[];
      date: Date;
      isInitial?: boolean;
    }> = [];

    // Add initial decision options
    optionHistory.push({
      options: decision.options,
      date: decision.createdAt,
      isInitial: true,
    });

    // Add all reflection option changes
    if (decision.reflections) {
      decision.reflections
        .filter((reflection) => reflection.optionChanges?.newOptions)
        .sort((a, b) => a.reflectionDate.getTime() - b.reflectionDate.getTime())
        .forEach((reflection) => {
          if (reflection.optionChanges?.newOptions) {
            optionHistory.push({
              options: reflection.optionChanges.newOptions,
              date: reflection.reflectionDate,
            });
          }
        });
    }

    // Process each option snapshot to build aggregated view
    optionHistory.forEach((snapshot, index) => {
      const isInitial = snapshot.isInitial || false;
      const isLatest = index === optionHistory.length - 1;

      snapshot.options.forEach((option) => {
        if (!optionMap.has(option.id)) {
          // First time seeing this option
          optionMap.set(option.id, {
            id: option.id,
            text: option.text,
            selected: option.selected,
            status: isInitial ? "initial" : "new",
            createdDate: isInitial ? decision.createdAt : snapshot.date,
            pros: option.pros,
            cons: option.cons,
          });
        } else {
          // Update existing option
          const existing = optionMap.get(option.id)!;
          existing.text = option.text; // Update text in case it changed
          existing.selected = option.selected; // Update selection
          existing.status = isLatest ? "current" : existing.status;
          existing.pros = option.pros;
          existing.cons = option.cons;
        }
      });

      // Mark options as deleted if they were in previous snapshot but not current
      if (index > 0) {
        const currentOptionIds = new Set(snapshot.options.map((o) => o.id));
        const previousSnapshot = optionHistory[index - 1];

        previousSnapshot.options.forEach((prevOption) => {
          if (!currentOptionIds.has(prevOption.id)) {
            const existing = optionMap.get(prevOption.id);
            if (existing && existing.status !== "deleted") {
              existing.status = "deleted";
              existing.deletedDate = snapshot.date;
              existing.selected = false; // Deleted options are never selected
            }
          }
        });
      }
    });

    // Final pass: ensure the most recent selection state is accurate
    if (optionHistory.length > 0) {
      const latestOptions = optionHistory[optionHistory.length - 1].options;
      latestOptions.forEach((option) => {
        const aggregated = optionMap.get(option.id);
        if (aggregated && aggregated.status !== "deleted") {
          aggregated.selected = option.selected;
        }
      });
    }

    return Array.from(optionMap.values()).sort((a, b) => {
      // Sort by: selected first, then by status (initial, new, deleted), then by creation date
      if (a.selected !== b.selected) {
        return a.selected ? -1 : 1;
      }

      const statusOrder = { initial: 0, current: 1, new: 2, deleted: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }

      // If both have creation dates, sort by date
      if (a.createdDate && b.createdDate) {
        return a.createdDate.getTime() - b.createdDate.getTime();
      }

      // Initial options (no creation date) come first
      if (!a.createdDate && b.createdDate) return -1;
      if (a.createdDate && !b.createdDate) return 1;

      return 0;
    });
  }, [decision]);

  const getOptionIcon = (option: AggregatedOption) => {
    if (option.status === "deleted") {
      return <X className="w-4 h-4 text-red-500" />;
    }

    if (option.selected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    return <Circle className="w-4 h-4 text-gray-400" />;
  };

  const getOptionTextClass = (option: AggregatedOption) => {
    if (option.status === "deleted") {
      return "line-through text-red-500";
    }

    if (option.selected) {
      return "text-green-700 dark:text-green-400 font-medium";
    }

    return "text-foreground";
  };

  const getOptionBorderClass = (option: AggregatedOption) => {
    if (option.status === "deleted") {
      return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20";
    }

    if (option.selected) {
      return "border-green-500 bg-green-50 dark:bg-green-950/20";
    }

    return "border-border/80";
  };

  const getStatusBadge = (option: AggregatedOption) => {
    switch (option.status) {
      case "new":
        return (
          <Badge variant="secondary" className="text-xs">
            New
          </Badge>
        );
      case "deleted":
        return (
          <Badge variant="destructive" className="text-xs">
            Deleted
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTimestampInfo = (option: AggregatedOption) => {
    if (!showTimestamps) return null;

    if (option.status === "deleted" && option.deletedDate) {
      return (
        <span className="text-xs text-red-600 dark:text-red-400">
          Deleted on {format(option.deletedDate, "MMM d, yyyy")}
        </span>
      );
    } else if (option.status === "new" && option.createdDate) {
      return (
        <span className="text-xs text-blue-600 dark:text-blue-400">
          Created on {format(option.createdDate, "MMM d, yyyy")}
        </span>
      );
    } else if (option.createdDate) {
      return (
        <span className="text-xs text-muted-foreground">
          Initial option from {format(option.createdDate, "MMM d, yyyy")}
        </span>
      );
    } else {
      return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Decision Options History</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete history of all options considered for this decision
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aggregatedOptions.map((option) => (
            <div
              key={option.id}
              className={`flex flex-col gap-2 p-3 rounded-lg border ${getOptionBorderClass(
                option
              )}`}
            >
              <div className="flex items-center gap-3">
                {getOptionIcon(option)}
                <span className={`flex-1 ${getOptionTextClass(option)}`}>
                  {option.text}
                </span>
                <div className="flex items-center gap-2">
                  {getStatusBadge(option)}
                </div>
              </div>

              {getTimestampInfo(option) && (
                <div className="ml-7">{getTimestampInfo(option)}</div>
              )}

              {showProsCons && (option.pros?.length || option.cons?.length) && (
                <div className="ml-7 space-y-2">
                  {option.pros && option.pros.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Pros:
                      </span>
                      <ul className="text-xs text-muted-foreground ml-2">
                        {option.pros.map((pro, index) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {option.cons && option.cons.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        Cons:
                      </span>
                      <ul className="text-xs text-muted-foreground ml-2">
                        {option.cons.map((con, index) => (
                          <li key={index}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {aggregatedOptions.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No options found for this decision.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
