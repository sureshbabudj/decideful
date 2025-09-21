"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Target,
  ArrowLeft,
  PencilLineIcon,
  CalendarClock,
  Star,
  Milestone,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Decision } from "@/types";
import { convertDecisionDates } from "@/lib/utils";
import Link from "next/link";
import { CATEGORIES, DECISION_TYPES } from "@/data/form-data";
import { Separator } from "@/components/ui/separator";
import { ReflectionInput } from "@/lib/schemas/decision.schema";
import { ReflectionForm } from "@/components/decisions/reflection-form";
import { AggregatedOptions } from "@/components/decisions/aggregated-options";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProgressTimeline } from "@/components/decisions/progress-timeline";

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
          const rawData = docSnap.data();
          const data = {
            ...rawData,
            id: docSnap.id,
          };

          convertDecisionDates(data);

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

  const handleReflectionSubmit = async (data: ReflectionInput) => {
    try {
      if (!decision) return;

      const reflections = [];
      if (decision.reflections && Array.isArray(decision.reflections)) {
        reflections.push(...decision.reflections);
      }

      // Generate a new reflection object with required properties
      const newReflection = {
        ...data,
        id: crypto.randomUUID(),
        decisionId: decision.id,
        userId: user?.uid ?? "",
        reflectionNumber: (decision.reflections?.length ?? 0) + 1,
        createdAt: new Date(),
        reflectionDate: new Date(),
        optionChanges: data.optionChanges
          ? {
              ...data.optionChanges,
              timestamp: data.optionChanges.changeDate ?? new Date(),
            }
          : undefined,
      };

      reflections.push(newReflection);

      await updateDoc(doc(db, "decisions", decision.id), {
        reflections: [...reflections],
        reviewed: true,
        actualOutcome: data.actualOutcome,
        updatedAt: serverTimestamp(),
      });

      setDecision({ ...decision, reflections, reviewed: true });
      setShowReflectionForm(false);
    } catch (error) {
      console.error("Error submitting reflection:", error);
      toast.error("Error submitting reflection. Please try again.");
    }
  };

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
          {!showReflectionForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReflectionForm(true)}
            >
              <Milestone className="w-3 h-3" /> Add Reflection
            </Button>
          )}
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

      <div className="space-y-6">
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

        <AggregatedOptions
          decision={decision}
          showTimestamps={true}
          showProsCons={false}
        />

        <ProgressTimeline decision={decision} />

        <Card>
          <CardHeader>
            <CardTitle>Expected Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">{decision.expectedOutcome}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reflections on {decision.title} </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {decision.reflections && decision.reflections.length > 0 ? (
              <>
                <Accordion type="single" collapsible className="w-full">
                  {decision.reflections?.map((reflection) => (
                    <AccordionItem
                      key={reflection.reflectionNumber}
                      value={String(reflection.reflectionNumber)}
                    >
                      <AccordionTrigger>
                        Reflection {reflection.reflectionNumber} -{" "}
                        {format(reflection.reflectionDate, "MMM d, yyyy")}
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-medium text-foreground/90 mb-2">
                              Actual Outcome
                            </h4>
                            <p className="text-foreground/70">
                              {reflection.actualOutcome}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground/90 mb-2">
                              Lessons Learned
                            </h4>
                            <p className="text-foreground/70">
                              {reflection.lessonsLearned}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground/90 mb-1">
                              Outcome Rating
                            </h4>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 rounded-full ${
                                    star <= reflection.outcomeRating
                                      ? "fill-yellow-400"
                                      : "fill-background/20"
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
                                reflection.wouldRepeat
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {reflection.wouldRepeat ? "Yes" : "No"}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground/90 mb-1">
                              Accuracy
                            </h4>
                            <Badge
                              variant={
                                (reflection.accuracy ?? 0) > 35
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {reflection.accuracy}% accurate
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground/90 mb-1">
                              Changes made to Options
                            </h4>
                            {reflection.optionChanges ? (
                              <div className="space-y-2 my-2">
                                {reflection.optionChanges?.newOptions.map(
                                  (option, index) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center gap-2"
                                    >
                                      <Checkbox
                                        checked={option.selected}
                                        className="opacity-100!"
                                        disabled
                                      />
                                      <Input
                                        value={option.text}
                                        disabled
                                        className="opacity-100!"
                                        placeholder={`Option ${index + 1}`}
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-foreground/70">
                                No changes made to options.
                              </p>
                            )}
                          </div>

                          {reflection.progressMetrics && (
                            <div>
                              <h4 className="font-medium text-foreground/90 my-2">
                                Progress Metrics
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(reflection.progressMetrics).map(
                                  ([key, metric]) => (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-sm text-foreground/70">
                                        {key === "skillLevel"
                                          ? "Skill Level"
                                          : ""}
                                        {key === "confidence"
                                          ? "Confidence"
                                          : ""}
                                        {key === "satisfaction"
                                          ? "Satisfaction"
                                          : ""}
                                      </span>
                                      <Badge>{metric}</Badge>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                          {reflection.nextSteps && (
                            <div>
                              <h4 className="font-medium text-foreground/90 my-2">
                                Next Steps
                              </h4>
                              <p className="text-foreground/70">
                                {reflection.nextSteps}
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : (
              <p className="text-foreground/70">No reflections yet.</p>
            )}
            <div>
              {!showReflectionForm ? (
                <Button onClick={() => setShowReflectionForm(true)}>
                  Add Reflection
                </Button>
              ) : (
                <>
                  {showReflectionForm && (
                    <ReflectionForm
                      decision={decision}
                      onSubmit={handleReflectionSubmit}
                      defaultValues={{
                        actualOutcome: "",
                        lessonsLearned: "",
                        outcomeRating: 3,
                        wouldRepeat: false,
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
