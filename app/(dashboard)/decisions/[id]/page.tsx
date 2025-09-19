"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  CheckCircle,
  Clock,
  ArrowLeft,
  PencilLineIcon,
  CalendarClock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Decision } from "@/types";
import { convertTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { DecisionReflectionForm } from "@/components/decisions/decision-reflection";
import { CATEGORIES, DECISION_TYPES } from "@/data/form-data";
import { Separator } from "@/components/ui/separator";

export default function DecisionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReflectionForm, setShowReflectionForm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchDecision = async () => {
      try {
        const docRef = doc(db, "decisions", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          const data = {
            ...docSnap.data(),
            id: docSnap.id,
            createdAt: convertTimeStamp(docSnap.data().createdAt),
            reviewDate: convertTimeStamp(docSnap.data().reviewDate),
            updatedAt: convertTimeStamp(docSnap.data().updatedAt),
          } as Decision;

          setDecision(data as Decision);
        } else {
          router.push("/decisions");
        }
      } catch (error) {
        console.error("Error fetching decision:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecision();
  }, [params.id, user, router]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!decision) {
    return <div className="flex justify-center p-8">Decision not found</div>;
  }

  const category =
    CATEGORIES.find((a) => a.value === decision.category)?.label ??
    decision.category;

  const decisionType =
    DECISION_TYPES.find((a) => a.type === decision.type)?.label ??
    decision.type;

  const updated =
    decision.updatedAt &&
    Math.abs(decision.updatedAt.getTime() - decision.createdAt.getTime()) >
      10 * 1000;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{category}</Badge>
            <Badge>{decisionType}</Badge>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" asChild size="sm">
            <Link href={`/decisions/${params.id}/edit`}>
              <PencilLineIcon className="w-3 h-3" />
              <span className="hidden md:block">Edit</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/decisions">
              <ArrowLeft className="w-3 h-3" />{" "}
              <span className="hidden md:block"> All Decisions</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground/90 m-0">
          {decision.title}
        </h1>
        <div className="text-xs md:text-sm text-foreground/60 mt-1 flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Created{" "}
            {formatDistanceToNow(decision.createdAt, { addSuffix: true })}
          </div>
          {decision.updatedAt && updated && (
            <>
              <Separator
                orientation="vertical"
                className="hidden md:block w-3 border-2 h-3"
              />
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" /> Updated{" "}
                {formatDistanceToNow(decision.updatedAt, {
                  addSuffix: true,
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">{decision.context}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options Considered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decision.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      option.selected
                        ? "border-green-500 dark:bg-green-900 bg-green-50"
                        : "border-border/80"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        option.selected
                          ? "border-green-500 bg-green-500"
                          : "border-border"
                      }`}
                    >
                      {option.selected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Outcome</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">{decision.expectedOutcome}</p>
            </CardContent>
          </Card>

          {decision.reflection && (
            <Card>
              <CardHeader>
                <CardTitle>Reflection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground/90 mb-2">
                    Actual Outcome
                  </h4>
                  <p className="text-foreground/70">
                    {decision.reflection.actualOutcome}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground/90 mb-2">
                    Lessons Learned
                  </h4>
                  <p className="text-foreground/70">
                    {decision.reflection.lessonsLearned}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium text-foreground/90 mb-1">
                      Outcome Rating
                    </h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-5 h-5 rounded-full ${
                            decision.reflection?.outcomeRating &&
                            star <= decision.reflection.outcomeRating
                              ? "bg-yellow-400"
                              : "bg-background/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground/90 mb-1">
                      Would Repeat?
                    </h4>
                    <Badge
                      variant={
                        decision.reflection.wouldRepeat
                          ? "default"
                          : "destructive"
                      }
                    >
                      {decision.reflection.wouldRepeat ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!decision.reflection && (
            <Card>
              <CardHeader>
                <CardTitle>Add Reflection</CardTitle>
              </CardHeader>
              <CardContent>
                {!showReflectionForm ? (
                  <Button onClick={() => setShowReflectionForm(true)}>
                    Add Reflection
                  </Button>
                ) : (
                  <DecisionReflectionForm
                    decision={decision}
                    toggleReflectionForm={setShowReflectionForm}
                    setDecision={setDecision}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Confidence Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={decision.confidence} className="h-2" />
              <p className="text-sm text-foreground/60 mt-2">
                {decision.confidence}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Review Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {decision.reviewed ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    Reviewed on {format(decision.reviewDate, "MMM d, yyyy")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">
                    {/* Fix: Only format valid date */}
                    Review due {format(decision.reviewDate, "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Category</span>
                <Badge>{category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Type</span>
                <Badge variant="outline">{decisionType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground/60">Created</span>
                <span className="text-sm">
                  {format(decision.createdAt, "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
