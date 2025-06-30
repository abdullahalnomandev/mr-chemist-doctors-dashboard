"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StepItem } from "./utils/step-item";
import { TreatmentSelect } from "./utils/treatment-select"; // Import the new component
import { ConsultationFormData, consultationSchema } from "./utils/types";

interface ConsultationFormProps {
  formId: string;
  onSubmit: (data: ConsultationFormData) => void;
  defaultValue?: ConsultationFormData;
}

export default function ConsultationForm({
  formId,
  onSubmit,
  defaultValue,
}: ConsultationFormProps) {
  const form = useForm<ConsultationFormData>({
    defaultValues: defaultValue || {
      title: "",
      subtitle: "",
      estimatedTime: 0,
      steps: [],
      treatment: "",
      isActive: true,
    },
    resolver: zodResolver(consultationSchema),
  });

  // Field array for steps
  const stepsFieldArray = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const onFormSubmit = form.handleSubmit((formData) => onSubmit(formData));

  // Helper function to add a new step
  const addStep = () => {
    const newPosition = stepsFieldArray.fields.length;
    stepsFieldArray.append({
      id: Date.now(),
      stepCode: `step_${Date.now()}`,
      title: "",
      position: newPosition,
      questions: [],
      treatmentTypes: [],
    });
  };

  return (
    // <FormProvider {...form}>
    <Form {...form}>
      <form id={formId} onSubmit={onFormSubmit} className="space-y-4">
        <Card className="border-1 shadow-none">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for this consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter estimated time"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Treatment Select */}
                <TreatmentSelect />
              </div>
            </div>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Steps</CardTitle>
              <CardDescription>
                Define the steps for this consultation
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={addStep}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent>
            {stepsFieldArray.fields.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-md">
                <p className="mb-4">No steps added yet</p>
                <Button type="button" variant="outline" onClick={addStep}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Step
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {stepsFieldArray.fields?.map((stepField, stepIndex) => (
                  <StepItem
                    key={stepField.id}
                    stepIndex={stepIndex}
                    stepsFieldArray={stepsFieldArray}
                  />
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
    // </FormProvider>
  );
}
