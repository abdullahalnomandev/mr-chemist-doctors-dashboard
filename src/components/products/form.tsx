"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { TreatmentSelect } from "../consultations/utils/treatment-select";
import { ImageUploadField } from "./utils/image-upload-field";

const variantTypes = ["weight", "volume", "unit", "pack"] as const;

const variantSchema = z.object({
  type: z.enum(variantTypes, {
    required_error: "Please select a variant type.",
    invalid_type_error: "Invalid variant type.",
  }),
  value: z.string().min(1, { message: "Value is required." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  price: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(val as string)),
    z.number().min(0.01, { message: "Price must be at least 0.01." })
  ),
  stock: z.preprocess(
    (val) => (val === "" ? undefined : parseInt(val as string, 10)),
    z.number().int().min(0, { message: "Stock must be a positive integer." })
  ),
});

const productFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(100),
  slug: z
    .string()
    .min(1, { message: "Slug is required." })
    .max(100)
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  description: z.string().optional(),
  basePrice: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0.01, { message: "Base price must be at least 0.01." })
  ),
  variants: z.array(variantSchema).optional(),
  imageUrls: z.array(z.string().url({ message: "Invalid URL format." })),
  treatment: z.string().min(1, { message: "Treatment is required." }),
  needConsultation: z.boolean().default(false),
  keyPoints: z
    .array(
      z.string().min(1, { message: "Key point cannot be empty." }).max(200)
    )
    .max(10, { message: "Maximum 10 key points allowed." }),
  isActive: z.boolean().default(true),
  files: z.array(z.instanceof(File)).optional(),
  metaTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(160).optional(),
  openGraphImageUrl: z.string().optional(),
  openGraphImageFile: z.instanceof(File).optional(),
  seoKeywords: z
    .array(z.string().min(1, { message: "Keyword cannot be empty." }).max(50))
    .max(10, { message: "Maximum 10 keywords allowed." }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  formId: string;
  onSubmit: (data: ProductFormData) => Promise<void> | void;
  defaultValue?: Partial<ProductFormData>;
}

export default function ProductForm({
  formId,
  onSubmit,
  defaultValue,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      basePrice: undefined,
      variants: [],
      imageUrls: [],
      treatment: "",
      needConsultation: false,
      keyPoints: ["Key point 1"],
      isActive: true,
      files: undefined,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      ...defaultValue,
    },
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const {
    fields: keyPointFields,
    append: appendKeyPoint,
    remove: removeKeyPoint,
  } = useFieldArray({
    control: form.control,
    name: "keyPoints" as never, // Fix for the type error
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "seoKeywords",
  });

  const onFormSubmit = form.handleSubmit(onSubmit);

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

  const addVariant = useCallback(() => {
    appendVariant({
      type: "weight",
      value: "",
      unit: "",
      price: undefined,
      stock: undefined,
    });
  }, [appendVariant]);

  const addKeyPoint = useCallback(() => {
    if (keyPointFields.length < 10) {
      appendKeyPoint("" as never); // Fix for the type error
    }
  }, [appendKeyPoint, keyPointFields.length]);

  const addKeyword = useCallback(() => {
    if (keywordFields.length < 10) {
      appendKeyword("");
    }
  }, [appendKeyword, keywordFields.length]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && !value.slug) {
        generateSlug();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, generateSlug]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onFormSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-5 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Slug*</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input placeholder="product-slug" {...field} />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateSlug}
                        className="whitespace-nowrap"
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <TreatmentSelect />
        </section>

        {/* Pricing Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Pricing</h3>
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? undefined : e.target.value
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <FormLabel>Product Variants</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Add different sizes or packaging options
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>

            {variantFields.map((field, index) => (
              <Card key={field.id} className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(index)}
                  className="absolute right-2 top-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {variantTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value*</FormLabel>
                          <FormControl>
                            <Input placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit*</FormLabel>
                          <FormControl>
                            <Input placeholder="mg, ml, tablets" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.01"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : e.target.value
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : e.target.value
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <FormLabel>Key Points</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Highlight important features (max 10)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyPoint}
                disabled={keyPointFields.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Key Point
              </Button>
            </div>

            {keyPointFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`keyPoints.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Key point ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyPoint(index)}
                  disabled={keyPointFields.length <= 1}
                  className="mt-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="needConsultation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Requires Consultation</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check if this product requires professional consultation
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Product Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Media Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Product Images</h3>
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <ImageUploadField
                value={field.value || []}
                onChange={(files: File[]) => field.onChange(files)}
              />
            )}
          />
        </section>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Enter detailed product description..."
                  minHeight="200px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SEO Section */}
        <section className="space-y-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SEO title (max 120 characters)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SEO description (max 160 characters)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <FormLabel>SEO Keywords</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Add relevant keywords (max 10)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyword}
                disabled={keywordFields.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Keyword
              </Button>
            </div>

            {keywordFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`seoKeywords.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Keyword ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyword(index)}
                  className="mt-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <section className="space-y-4">
              <h3 className="text-lg font-medium">Open Graph Image</h3>
              <FormField
                control={form.control}
                name="openGraphImageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {defaultValue?.openGraphImageUrl && (
                          <div className="relative w-full max-w-[200px] aspect-video">
                            <Image
                              width={200}
                              height={200}
                              src={defaultValue.openGraphImageUrl}
                              alt="Open Graph"
                              className="object-cover rounded-lg w-full h-full"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file || null);
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
        </section>
      </form>
    </Form>
  );
}
