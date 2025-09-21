"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  optionChangeSchema,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OptionChangeFormProps {
  previousOptions: OptionType[];
  onSubmit: (data: OptionChangeInput) => void;
  onCancel: () => void;
  show: boolean;
}

export function OptionChangeForm({
  show,
  previousOptions,
  onSubmit,
  onCancel,
}: OptionChangeFormProps) {
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<OptionChangeInput>({
    resolver: zodResolver(optionChangeSchema),
    defaultValues: {
      changeDate: new Date(),
      reason: "",
      newOptions: previousOptions,
    },
  });

  const { setValue, watch, handleSubmit, reset } = form;
  const newOptions = watch("newOptions");
  const reason = watch("reason");

  // Update form when previousOptions change
  useEffect(() => {
    if (previousOptions.length > 0) {
      setValue("newOptions", previousOptions);
      reset({
        changeDate: new Date(),
        reason: "",
        newOptions: previousOptions,
      });
    }
  }, [previousOptions, setValue, reset]);

  // Check if there are any changes
  useEffect(() => {
    const optionsChanged =
      JSON.stringify(previousOptions) !== JSON.stringify(newOptions);
    const hasReason = Boolean(reason && reason.trim().length > 0);
    setHasChanges(optionsChanged || hasReason);
  }, [previousOptions, newOptions, reason]);

  const addOption = () => {
    const newOption: OptionType = {
      id: Date.now().toString(),
      text: "",
      selected: false,
    };
    setValue("newOptions", [...newOptions, newOption]);
  };

  const removeOption = (id: string) => {
    if (newOptions.length > 2) {
      setValue(
        "newOptions",
        newOptions.filter((option) => option.id !== id)
      );
    }
  };

  const updateOption = (
    id: string,
    field: keyof OptionType,
    value: string | boolean
  ) => {
    setValue(
      "newOptions",
      newOptions.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const onFormSubmit = (data: OptionChangeInput) => {
    // Only submit if there are actual changes
    if (hasChanges) {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        className="md:w-3xl lg:w-4xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Review and Update Options</DialogTitle>
          <DialogDescription>
            You can modify your options, change selections, add new options, or
            remove existing ones. At least 2 options must remain to be there and
            1 remain selected.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="space-y-6 overflow-y-auto p-4 max-h-[60vh]">
              {/* New Options (Editable) */}
              <FormField
                control={form.control}
                name="newOptions"
                render={() => (
                  <FormItem>
                    <FormLabel>Updated Options</FormLabel>
                    <div className="space-y-2">
                      {newOptions.map((option, index) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <FormField
                            control={form.control}
                            name={`newOptions.${index}.selected`}
                            render={() => (
                              <FormControl>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Checkbox
                                      checked={option.selected}
                                      onCheckedChange={(checked) =>
                                        updateOption(
                                          option.id,
                                          "selected",
                                          checked
                                        )
                                      }
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Check to select this option
                                  </TooltipContent>
                                </Tooltip>
                              </FormControl>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`newOptions.${index}.text`}
                            render={() => (
                              <FormControl>
                                <Input
                                  value={option.text}
                                  onChange={(e) =>
                                    updateOption(
                                      option.id,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Option ${index + 1}`}
                                />
                              </FormControl>
                            )}
                          />
                          {newOptions.length > 2 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(option.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remove this option
                              </TooltipContent>
                            </Tooltip>
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
                )}
              />

              {/* Reason for Change */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Reason for Change (Optional)</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        Explain why you&apos;re making these changes to your
                        options
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Why are you making these changes to your options?"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Validation Alerts */}
            {newOptions.filter((opt) => opt.selected).length === 0 && (
              <Alert variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  At least one option should be selected.
                </AlertDescription>
              </Alert>
            )}

            {newOptions.some((opt) => opt.text.trim() === "") && (
              <Alert variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>All options must have text.</AlertDescription>
              </Alert>
            )}

            {!hasChanges && (
              <Alert variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No changes detected. Modify options or add a reason to
                  proceed.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={
                  !hasChanges ||
                  newOptions.some((opt) => opt.text.trim() === "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(onFormSubmit)();
                }}
              >
                Save Option changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
