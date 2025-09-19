"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  decisionSchema,
  DecisionInput,
  CategoryType,
  DecisionType,
  ReviewFrequencyType,
} from "@/lib/schemas/decision.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoryTemplates } from "@/data/templates";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { CATEGORIES, DECISION_TYPES, REVIEW_REMINDER } from "@/data/form-data";
import { convertTimeStamp } from "@/lib/utils";
import { Decision } from "@/types";

export default function DecisionForm({
  type = "detailed",
  template,
  decisionId = null,
}: {
  type?: string;
  template?: string;
  decisionId?: string | null;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);

  useEffect(() => {
    if (!user || !decisionId) return;

    setLoading(true);

    const fetchDecision = async () => {
      try {
        const docRef = doc(db, "decisions", decisionId as string);
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
  }, [decisionId, user, router]);

  const initialOptions = [
    { id: "1", text: "", selected: false },
    { id: "2", text: "", selected: false },
  ];

  let defaultValues = {
    title: "",
    context: "",
    expectedOutcome: "",
    type: type as DecisionType,
    category: "work" as CategoryType,
    options: initialOptions.map((opt) => ({
      ...opt,
      selected: opt.selected ?? false,
    })),
    reviewReminder: "1 month" as ReviewFrequencyType,
    confidence: 0,
  };

  if (!decisionId && template) {
    const [category, index] = template.split("-");
    if (category && index) {
      // Find the template from the data
      const templateData = categoryTemplates.find(
        (cat) => cat.category.toLowerCase() === category
      )?.templates[parseInt(index, 10)];
      if (templateData) {
        defaultValues = { confidence: 50, ...templateData.formData };
      }
    }
  }

  const form = useForm<DecisionInput>({
    resolver: zodResolver(decisionSchema),
    defaultValues,
  });
  const { setValue, watch, handleSubmit, reset } = form;

  useEffect(() => {
    if (decision) {
      // Fetch existing decision data and set as defaultValues
      const reviewReminderValue = REVIEW_REMINDER.find((option) => {
        const reviewDate = new Date(decision.reviewDate);
        const now = new Date();
        const diffTime = Math.abs(reviewDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return option.unit === "days"
          ? option.number === diffDays
          : option.unit === "months"
          ? option.number === Math.round(diffDays / 30)
          : option.unit === "years"
          ? option.number === Math.round(diffDays / 365)
          : false;
      })?.value as ReviewFrequencyType | undefined;

      const decisionData = {
        title: decision.title,
        context: decision.context,
        expectedOutcome: decision.expectedOutcome,
        type: decision.type as DecisionType,
        category: decision.category as CategoryType,
        options: decision.options.map((opt) => ({
          ...opt,
          selected: opt.selected ?? false,
        })),
        reviewReminder: reviewReminderValue || "1 month",
        confidence: decision.confidence,
      };

      reset(decisionData); // Update form with fetched data
    }
  }, [decision, reset]);

  const options = watch("options");

  const addDecision = async (data: DecisionInput) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const reviewDate = calculateReviewDate(data.reviewReminder);

    await addDoc(collection(db, "decisions"), {
      ...data,
      userId: user.uid,
      confidence: data.confidence || 50,
      reviewed: false,
      reviewDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    router.push("/decisions");
  };

  const updateDecision = async (data: DecisionInput) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (!decisionId) {
      throw new Error("Decision ID is required for update");
    }
    const reviewDate = calculateReviewDate(data.reviewReminder);

    await updateDoc(doc(db, "decisions", decisionId), {
      ...data,
      reviewDate,
      updatedAt: serverTimestamp(),
    });

    router.push(`/decisions/${decisionId}`);
  };

  const onSubmit = async (data: DecisionInput) => {
    try {
      setLoading(true);
      setError(null);

      if (decisionId) {
        await updateDecision(data);
      } else {
        await addDecision(data);
      }
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to create decision");
    } finally {
      setLoading(false);
    }
  };

  const calculateReviewDate = (frequency: string): Date => {
    const opt = REVIEW_REMINDER.find((option) => option.value === frequency);

    const now = new Date();
    const date = new Date(now);

    if (opt) {
      if (opt.unit === "days") {
        date.setDate(now.getDate() + opt.number);
        return date;
      }
      if (opt.unit === "months") {
        date.setMonth(now.getMonth() + opt.number);
        return date;
      }
      if (opt.unit === "years") {
        date.setFullYear(now.getFullYear() + opt.number);
        return date;
      }
    }

    date.setMonth(now.getMonth() + 1);
    return date;
  };

  const addOption = () => {
    const newOption = {
      id: Date.now().toString(),
      text: "",
      selected: false,
    };
    // Ensure all options have selected: boolean
    setValue(
      "options",
      [...options, newOption].map((opt) => ({
        ...opt,
        selected: opt.selected ?? false,
      }))
    );
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setValue(
        "options",
        options
          .filter((option) => option.id !== id)
          .map((opt) => ({ ...opt, selected: opt.selected ?? false }))
      );
    }
  };

  const updateOption = (id: string, text?: string, selected?: boolean) => {
    setValue(
      "options",
      options.map((option) =>
        option.id === id
          ? {
              ...option,
              text: text ?? option.text,
              selected: selected ?? option.selected ?? false,
            }
          : option
      )
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Choose a new software development methodology"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[90%]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision Type</FormLabel>
                    <FormControl>
                      <div className="flex rounded-lg bg-background/10 border p-1">
                        {DECISION_TYPES.map(({ type, label }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                              field.value === type
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-foreground/70 hover:text-foreground/90"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Context & Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s the context?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the current situation, the problem you're trying to solve, or the opportunity you're considering."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>What are your options?</FormLabel>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.selected`}
                      render={() => (
                        <FormControl>
                          <Checkbox
                            checked={option.selected}
                            onCheckedChange={() =>
                              updateOption(
                                option.id,
                                undefined,
                                !option.selected
                              )
                            }
                          />
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={() => (
                        <FormControl>
                          <Input
                            value={option.text}
                            onChange={(e) =>
                              updateOption(option.id, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                          />
                        </FormControl>
                      )}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <FormMessage />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addOption}
                className="mt-2 w-fit"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </FormItem>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expected Outcome</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="expectedOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you expect to achieve?</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe what you hope to achieve by making this decision."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="confidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How confident are you about this decision?
                  </FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value ?? 0]}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      className={`w-[${field.value ?? 0}%]`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="reviewReminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Set Review Reminder</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_REMINDER.map(({ value, label }) => (
                          <SelectItem value={value} key={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-between md:justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/decisions")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? decisionId
                ? "Creating..."
                : "Updating"
              : decisionId
              ? "Update Decision"
              : "Create Decision"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
