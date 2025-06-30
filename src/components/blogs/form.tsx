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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { TreatmentSelect } from "../consultations/utils/treatment-select";
import { ImageUploadField } from "./utils/image-upload-field";

const blogFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(120),
  slug: z
    .string()
    .min(1, { message: "Slug is required." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  excerpt: z.string().min(1, { message: "Excerpt is required." }).max(200),
  content: z.string().min(1, { message: "Content is required." }),
  imageUrls: z.array(z.string().url({ message: "Invalid URL format." })),
  treatment: z.string().min(1, { message: "Treatment is required." }),
  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty." }).max(50))
    .max(10, { message: "Maximum 10 tags allowed." }),
  isPublished: z.boolean().default(true),
  metaTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(160).optional(),
  openGraphImageUrl: z.string().optional(),
  openGraphImageFile: z.instanceof(File).optional(),
  seoKeywords: z
    .array(z.string().min(1, { message: "Keyword cannot be empty." }).max(50))
    .max(10, { message: "Maximum 10 keywords allowed." }),
  files: z.array(z.instanceof(File)).optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  formId: string;
  onSubmit: (data: BlogFormData) => Promise<void> | void;
  defaultValue?: Partial<BlogFormData>;
}

export default function BlogForm({
  formId,
  onSubmit,
  defaultValue,
}: BlogFormProps) {
  const form = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrls: [],
      treatment: "",
      tags: [],
      isPublished: true,
      metaTitle: "",
      metaDescription: "",
      seoKeywords: [],
      ...defaultValue,
    },
    resolver: zodResolver(blogFormSchema),
    mode: "onBlur",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
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
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [form]);

  const addTag = useCallback(() => {
    if (tagFields.length < 10) {
      appendTag("");
    }
  }, [appendTag, tagFields.length]);

  const addKeyword = useCallback(() => {
    if (keywordFields.length < 10) {
      appendKeyword("");
    }
  }, [appendKeyword, keywordFields.length]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && !value.slug) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug*</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input placeholder="blog-post-slug" {...field} />
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

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief summary of the blog post (max 200 characters)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TreatmentSelect />
        </section>

        {/* Content Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Content</h3>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content*</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write your blog post content here..."
                    minHeight="400px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Media Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Blog Images</h3>
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

        {/* Tags Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <FormLabel>Tags</FormLabel>
              <p className="text-sm text-muted-foreground">
                Add relevant tags (max 10)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTag}
              disabled={tagFields.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Tag
            </Button>
          </div>

          {tagFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`tags.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Tag ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTag(index)}
                className="mt-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </section>

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

        {/* Publication Status */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Publication</h3>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Publish Status</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value ? "Published" : "Draft"}
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
        </section>
      </form>
    </Form>
  );
}
