import { z } from "zod";

// Define a schema using zod
export const optionSchema = z.object({
  id: z.number(),
  value: z.string(),
  label: z.string(),
  position: z.number(),
});

export const questionSchema = z.object({
  id: z.number(),
  questionCode: z.string(),
  type: z.enum([
    "yesNo",
    "text",
    "textarea",
    "checkbox",
    "radio",
    "select",
    "date",
    "number",
    "checkboxGroup",
  ]),
  question: z.string().optional(),
  required: z.boolean().default(false),
  description: z.string().optional(),
  position: z.number(),
  treatmentTypes: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string().optional(),
  options: z.array(optionSchema).optional(),
  allowMultiple: z.boolean().optional(),
  noneOption: z.string().optional(),
  conditionalQuestions: z
    .object({
      yes: z.array(z.any()).optional(),
      no: z.array(z.any()).optional(),
    })
    .optional(),
});

export const stepSchema = z.object({
  id: z.number(),
  stepCode: z.string(),
  title: z.string(),
  position: z.number(),
  questions: z.array(questionSchema),
  treatmentTypes: z.array(z.string()).optional(),
});

export const consultationSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  estimatedTime: z.number().optional(),
  
  steps: z.array(stepSchema),
  treatment: z.string(),
  isActive: z.boolean().default(true),
});

// Derive TypeScript types from the schemas
export type Option = z.infer<typeof optionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Step = z.infer<typeof stepSchema>;
export type ConsultationFormData = z.infer<typeof consultationSchema>;

export type QuestionType = Question["type"];
