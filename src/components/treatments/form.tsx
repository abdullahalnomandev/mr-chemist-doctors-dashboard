"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // Ensure you have a Switch component
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { ImageUploadField } from "./utils/image-upload-field";
import { QuestionariesSelect } from "./utils/questionaries-select";

// Define a schema using zod
const treatmentFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slug: z.string().min(1, { message: "Code is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  isActive: z.boolean(),
  logoUrl: z.string().optional(),
  questionsId: z.string().optional(),
  file: z.instanceof(File).optional().nullable(),
});

// Derive TypeScript type from the schema
export type TreatmentFormData = z.infer<typeof treatmentFormSchema>;

interface TreatmentFormProps {
  formId: string;
  onSubmit: (data: TreatmentFormData) => void;
  defaultValue?: TreatmentFormData;
}

export default function TreatmentForm({
  formId,
  onSubmit,
  defaultValue,
}: TreatmentFormProps) {
  const form = useForm<TreatmentFormData>({
    defaultValues: defaultValue || {
      name: "",
      slug: "",
      description: "",
      isActive: false,
      logoUrl: "",
      questionsId: "",
    },
    resolver: zodResolver(treatmentFormSchema),
  });

  const onFormSubmit = form.handleSubmit((formData) => onSubmit(formData));

  const generateSlug = useCallback(() => {
    const name = form.getValues("name");
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [form]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onFormSubmit} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className='flex gap-2 items-center'>
                <FormControl>
                  <Input placeholder='Enter slug' {...field} />
                </FormControl>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={generateSlug}>
                  <RefreshCw className='h-4 w-4' />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder='Enter description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center gap-2'>
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

        <QuestionariesSelect />

        <section className='space-y-4'>
          <h3 className='text-lg font-medium'>Treatment Logo</h3>
          <ImageUploadField />
        </section>
      </form>
    </Form>
  );
}
