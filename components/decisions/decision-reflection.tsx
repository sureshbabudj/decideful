"use client";

import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  reflectionSchema,
  ReflectionInput,
} from "@/lib/schemas/decision.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Decision } from "@/types";

// ...existing code...
export function DecisionReflectionForm({
  decision,
  setDecision,
  toggleReflectionForm,
}: {
  decision: Decision | null;
  setDecision: (decision: Decision) => void;
  toggleReflectionForm: (show: boolean) => void;
}) {
  const form = useForm<ReflectionInput>({
    resolver: zodResolver(reflectionSchema),
  });
  const { handleSubmit, control } = form;
  const onSubmitReflection = async (data: ReflectionInput) => {
    try {
      if (!decision) return;

      await updateDoc(doc(db, "decisions", decision.id), {
        reflection: data,
        reviewed: true,
        actualOutcome: data.actualOutcome,
        updatedAt: serverTimestamp(),
      });

      setDecision({ ...decision, reflection: data, reviewed: true });
      toggleReflectionForm(false);
    } catch (error) {
      console.error("Error submitting reflection:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitReflection)} className="space-y-4">
        <FormField
          control={control}
          name="actualOutcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Outcome</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What actually happened?"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lessonsLearned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lessons Learned</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What did you learn from this decision?"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="outcomeRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome Rating</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="wouldRepeat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Would you make the same decision again?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(val) => field.onChange(val === "true")}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit">Save Reflection</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleReflectionForm(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
