"use client";

import { MoveDown, MoveUp, PlusCircle, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type UseFieldArrayReturn,
} from "react-hook-form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionItem } from "./question-item";
import { ConsultationFormData } from "./types";

interface StepItemProps {
  stepIndex: number;
  stepsFieldArray: UseFieldArrayReturn<ConsultationFormData, "steps", "id">;
}

export function StepItem({ stepIndex, stepsFieldArray }: StepItemProps) {
  const form = useFormContext<ConsultationFormData>();

  // Field array for questions in this step
  const questionsFieldArray = useFieldArray({
    control: form.control,
    name: `steps.${stepIndex}.questions`,
  });

  // Helper function to add a new question to a step
  const addQuestion = () => {
    const questions = form.getValues(`steps.${stepIndex}.questions`) || [];
    const newPosition = questions.length;

    questionsFieldArray.append({
      id: Date.now(),
      questionCode: `question_${Date.now()}`,
      type: "text",
      question: "",
      required: false,
      description: "",
      position: newPosition,
      treatmentTypes: [],
      placeholder: "",
      prefix: "",
      suffix: "",
      label: "",
      options: [],
      allowMultiple: false,
      noneOption: "",
    });
  };

  return (
    <AccordionItem
      value={`step-${stepIndex}`}
      className="border border-border rounded-md mb-4 overflow-hidden"
    >
      <AccordionTrigger className="px-6 py-4 bg-secondary hover:bg-secondary/80 transition-colors">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white">
              Step {stepIndex + 1}
            </Badge>
            <span className="font-medium text-lg">
              {form.watch(`steps.${stepIndex}.title`) || `Untitled Step`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <div
                role="button"
                tabIndex={0}
                className="p-2 rounded hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  stepsFieldArray.move(stepIndex, stepIndex - 1);
                }}
              >
                <MoveUp className="h-4 w-4" />
              </div>
            )}
            {stepIndex < stepsFieldArray.fields.length - 1 && (
              <div
                role="button"
                tabIndex={0}
                className="p-2 rounded hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  stepsFieldArray.move(stepIndex, stepIndex + 1);
                }}
              >
                <MoveDown className="h-4 w-4" />
              </div>
            )}
            <div
              role="button"
              tabIndex={0}
              className="p-2 rounded hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                stepsFieldArray.remove(stepIndex);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pt-6 pb-4 space-y-4 bg-white">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.stepCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.position`}
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.treatmentTypes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Types</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Comma-separated treatment types"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value
                            ? value.split(",").map((item) => item.trim())
                            : []
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter treatment types separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium">Questions</h4>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questionsFieldArray.fields.length === 0 ? (
            <div className="text-center py-8 border-1 border-dashed border-border rounded-md">
              <p className="text-secondary-foreground">
                No questions added yet
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addQuestion}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Question
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {questionsFieldArray.fields.map(
                (questionField, questionIndex) => (
                  <QuestionItem
                    key={questionField.id}
                    stepIndex={stepIndex}
                    questionIndex={questionIndex}
                    questionsFieldArray={questionsFieldArray}
                  />
                )
              )}
            </Accordion>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
