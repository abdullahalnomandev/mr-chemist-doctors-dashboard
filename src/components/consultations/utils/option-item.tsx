"use client";

import { Trash2 } from "lucide-react";
import type { UseFieldArrayReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConsultationFormData } from "./types";

interface OptionItemProps {
  stepIndex: number;
  questionIndex: number;
  optionIndex: number;
  optionsFieldArray: UseFieldArrayReturn<
    ConsultationFormData,
    `steps.${number}.questions.${number}.options`,
    "id"
  >;
}

export function OptionItem({
  stepIndex,
  questionIndex,
  optionIndex,
  optionsFieldArray,
}: OptionItemProps) {
  const form = useFormContext<ConsultationFormData>();

  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2 bg-secondary p-2 rounded-md">
      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`steps.${stepIndex}.questions.${questionIndex}.options.${optionIndex}.position`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-4">
        <FormField
          control={form.control}
          name={`steps.${stepIndex}.questions.${questionIndex}.options.${optionIndex}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Value" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-6">
        <FormField
          control={form.control}
          name={`steps.${stepIndex}.questions.${questionIndex}.options.${optionIndex}.label`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Label" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => optionsFieldArray.remove(optionIndex)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}
