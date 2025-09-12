"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { decisionFormSchema, type DecisionFormData } from "@/utils/validation";
import { MilestoneCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DecisionFormProps {
  initialData?: Partial<DecisionFormData>;
  onSubmit: (data: DecisionFormData) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

const milestoneCategories: { value: MilestoneCategory; label: string }[] = [
  { value: "skill", label: "Skill Development" },
  { value: "money", label: "Financial Impact" },
  { value: "network", label: "Network Building" },
  { value: "familiarity", label: "Familiarity/Comfort" },
  { value: "other", label: "Other" },
];

// Helper function to format date for input[type="date"]
const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "yyyy-MM-dd");
};

export function DecisionForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: DecisionFormProps) {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      context: initialData?.context || "",
      finalChoice: initialData?.finalChoice || "",
      expectedOutcome: initialData?.expectedOutcome || "",
      reviewDate: formatDateForInput(
        initialData?.reviewDate ||
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      ),
      milestones: initialData?.milestones?.length
        ? initialData.milestones.map((milestone) => ({
            description: milestone.description,
            expectedDate: formatDateForInput(milestone.expectedDate),
            category: milestone.category,
          }))
        : [
            {
              description: "",
              expectedDate: formatDateForInput(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              ), // 30 days from now
              category: "other" as MilestoneCategory,
            },
          ],
    },
  });

  const {
    control,
    formState: { isSubmitting },
    reset,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "milestones",
  });

  const handleFormSubmit = async (data: DecisionFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const addMilestone = () => {
    append({
      description: "",
      expectedDate: formatDateForInput(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      category: "other" as MilestoneCategory,
    });
  };

  const removeMilestone = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decision Title *</FormLabel>
              <FormControl>
                <Input placeholder="What decision are you making?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context & Background *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the situation and factors influencing your decision..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="finalChoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Choice *</FormLabel>
              <FormControl>
                <Input placeholder="What did you decide to do?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectedOutcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Outcome *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you expect to happen as a result of this decision?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reviewDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Review Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When do you want to review the outcome of this decision?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Milestones Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="text-base sm:text-lg">Milestones</CardTitle>
              <Button
                type="button"
                onClick={addMilestone}
                disabled={fields.length >= 10}
                variant="outline"
                size="sm"
                className="min-h-[44px] touch-manipulation"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="border-muted">
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">
                        Milestone {index + 1}
                      </h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Milestone Description */}
                      <div className="md:col-span-2 space-y-2">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Milestone Description *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What milestone do you expect to achieve?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full truncate">
                                    <SelectValue
                                      className="truncate w-full"
                                      placeholder="Select a category"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {milestoneCategories.map((category) => (
                                    <SelectItem
                                      key={category.value}
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription></FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Expected Date */}
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}.expectedDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Expected Date *</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={new Date(field.value)}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    captionLayout="dropdown"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                When do you want to review the outcome of this
                                decision?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="mb-4" />
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="min-h-[44px] touch-manipulation"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="min-h-[44px] touch-manipulation"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Decision"
            ) : (
              "Create Decision"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
