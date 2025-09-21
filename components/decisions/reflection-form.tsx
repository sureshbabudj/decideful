"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reflectionSchema,
  ReflectionInput,
  OptionChangeInput,
  OptionType,
} from "@/lib/schemas/decision.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Decision } from "@/types";
import { useEffect, useState } from "react";
import { OptionChangeForm } from "./option-change-form";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

export function ReflectionForm({
  decision,
  onSubmit,
  defaultValues,
}: {
  decision: Decision;
  onSubmit: (data: ReflectionInput) => void;
  defaultValues?: Partial<ReflectionInput>;
}) {
  const [previousOptions, setPreviousOptions] = useState<OptionType[]>([]);
  const [showOptionChange, setShowOptionChange] = useState(false);
  const [newOptions, setNewOptions] = useState<OptionType[] | null>(null);

  const form = useForm<ReflectionInput>({
    resolver: zodResolver(reflectionSchema),
    defaultValues,
  });
  const { control, handleSubmit } = form;

  useEffect(() => {
    let currentOptions: OptionType[] = [];
    const { reflections = [], options } = decision;
    if (reflections && reflections.length > 0) {
      const last = reflections[reflections.length - 1].optionChanges;
      currentOptions = last ? [...last.newOptions] : [];
    }

    if (currentOptions.length === 0) {
      currentOptions = [...options];
    }

    setPreviousOptions(currentOptions);
  }, [decision, showOptionChange]);

  const handleOptionChange = async (optionChangeInput: OptionChangeInput) => {
    console.log("Option change submitted:", optionChangeInput);
    form.setValue("optionChanges", optionChangeInput);
    setNewOptions(optionChangeInput.newOptions);
    setShowOptionChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="mb-4 text-md text-muted-foreground">
          Reflect on your decision and update the details below.
        </p>
        <div className="space-y-8">
          {/* Actual Outcome */}
          <FormField
            control={control}
            name="actualOutcome"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Actual Outcome</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      What actually happened after making the decision?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe the actual outcome..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Lessons Learned */}
          <FormField
            control={control}
            name="lessonsLearned"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Lessons Learned</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      What did you learn from this decision?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your lessons learned..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Outcome Rating */}
          <FormField
            control={control}
            name="outcomeRating"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Outcome Rating</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rate the outcome from 1 (Very Poor) to 5 (Excellent).
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
          {/* Would Repeat */}
          <FormField
            control={control}
            name="wouldRepeat"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Would Repeat?</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      Would you make the same decision again?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
          {/* Accuracy */}
          <FormField
            control={control}
            name="accuracy"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Accuracy (%)</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      How accurate was your prediction? (0-100%)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Slider
                    value={[field.value ?? 0]}
                    max={100}
                    step={1}
                    onValueChange={(val) => field.onChange(val[0])}
                    className={`w-[${field.value ?? 0}%]`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Progress Metrics */}
          <FormField
            control={control}
            name="progressMetrics.skillLevel"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Skill Level (1-10)</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rate your skill level after this decision.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Slider
                    value={[field.value ?? 1]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(val) => field.onChange(val[0])}
                    className={`w-[${field.value ?? 1}0%]`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="progressMetrics.confidence"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Confidence (%)</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      How confident are you now? (0-100%)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Slider
                    value={[field.value ?? 0]}
                    max={100}
                    step={1}
                    onValueChange={(val) => field.onChange(val[0])}
                    className={`w-[${field.value ?? 0}%]`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="progressMetrics.satisfaction"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Satisfaction (1-5)</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      How satisfied are you with the outcome?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Not Satisfied</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5 - Very Satisfied</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="py-4">
            <h3 className="text-md">Decision Options Review</h3>
            <h5 className="text-sm">
              Review your decision options and make changes if needed.
            </h5>
            <div>
              <div className="space-y-2 my-2">
                {previousOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox checked={option.selected} disabled />
                    <Input
                      value={option.text}
                      disabled
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {newOptions ? (
                <>
                  <p className="py-4 text-md text-green-600 font-medium">
                    The updated options are as below:
                  </p>

                  <div className="space-y-2 my-2">
                    {newOptions.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Checkbox checked={option.selected} disabled />
                        <Input
                          value={option.text}
                          disabled
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    className="mt-2"
                    type="button"
                    onClick={() => setNewOptions(null)}
                    variant={"outline"}
                  >
                    Reset Updated Options
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="mt-2"
                  onClick={() => {
                    setShowOptionChange(true);
                  }}
                  variant={"outline"}
                >
                  Review & Update Options
                </Button>
              )}
            </div>

            <OptionChangeForm
              show={showOptionChange}
              previousOptions={previousOptions}
              onCancel={() => setShowOptionChange(false)}
              onSubmit={handleOptionChange}
            />
          </div>
          {/* Next Steps */}
          <FormField
            control={control}
            name="nextSteps"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Next Steps</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      What are your next steps after this reflection?
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your next steps..."
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4">
          Save Reflection
        </Button>
      </form>
    </Form>
  );
}
