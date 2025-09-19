"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CATEGORIES, DECISION_TYPES } from "@/data/form-data";
import { Default_Gradients, Light_Gradients } from "../layout/gradiant-bg";
import React, { useEffect, useState } from "react";

interface DecisionCardProps {
  decision: {
    id: string;
    title: string;
    category: string;
    type: string;
    confidence: number;
    reviewDate: Date;
    reviewed: boolean;
    createdAt: Date;
  };
}

export function DecisionCard({ decision }: DecisionCardProps) {
  const router = useRouter();

  const getStatusBadge = () => {
    if (decision.reviewed) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Reviewed
        </Badge>
      );
    }
    const reviewDate = new Date(decision.reviewDate);
    const today = new Date();
    if (reviewDate < today) {
      return (
        <Badge variant="destructive">
          <Clock className="w-3 h-3 mr-1" />
          Review Overdue
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <Calendar className="w-3 h-3 mr-1" />
        Review {format(reviewDate, "MMM d")}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    if (confidence >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const category =
    CATEGORIES.find((a) => a.value === decision.category)?.label ??
    decision.category;

  const decisionType =
    DECISION_TYPES.find((a) => a.type === decision.type)?.label ??
    decision.type;

  const [gradients, setGradients] = useState(Default_Gradients);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        setGradients(Default_Gradients);
      } else {
        setGradients(Light_Gradients);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    handleChange(); // Initial check
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative">
      {decision.reviewed && (
        <motion.div
          className="absolute inset-0 z-0 rounded-2xl opacity-40"
          style={{ background: gradients[0] }}
          animate={{ background: gradients }}
          transition={{
            delay: 0.6,
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
      <Card
        className={cn("hover:shadow-md transition-shadow cursor-pointer", {
          "bg-transparent": decision.reviewed,
        })}
        onClick={() => router.push(`/decisions/${decision.id}`)}
      >
        <CardHeader className={cn({ "z-10": decision.reviewed })}>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg line-clamp-2">
              {decision.title}
            </CardTitle>
            <Badge variant="outline">{category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Badge variant="outline" className="text-xs">
              {decisionType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className={cn({ "z-10": decision.reviewed })}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground/60">
                  Confidence Level
                </span>
                <span className="text-sm font-medium">
                  {decision.confidence}%
                </span>
              </div>
              <Progress
                value={decision.confidence}
                className={cn("h-2", getConfidenceColor(decision.confidence))}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-foreground/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(decision.createdAt, "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {decisionType}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
