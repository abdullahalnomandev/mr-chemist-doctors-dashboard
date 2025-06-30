"use client";

import BlogForm, { BlogFormData } from "@/components/blogs/form";
import { Button } from "@/components/ui/button";
import { ErrorResultMessage } from "@/components/ui/data-result-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";

const UPDATE_BLOG_MUTATION_KEY = QK.BLOG + "_EDIT";

export default function EditPage({ blogId }: { blogId: string }) {
  const qc = useQueryClient();

  const {
    data: blog,
    isLoading: isLoadingBlog,
    isError: isErrorBlog,
  } = useQuery({
    queryKey: [QK.BLOG, { id: blogId }],
    queryFn: () => serverApiRequest("get", `/blogs/id/${blogId}`),
    enabled: !!blogId,
    select: (data) => data.data,
  });

  // Add this mutation hook near other query/mutation hooks
  const { mutateAsync: deleteImages, isPending: isPendingDeleteImages } =
    useMutation({
      mutationFn: async (urls: string[]) => {
        const response = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls }),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error("Some images couldn't be deleted from storage");
        }
        return result;
      },
    });

  const { mutate: updateBlog, isPending: isPendingBlogUpdate } = useMutation({
    mutationKey: [UPDATE_BLOG_MUTATION_KEY],
    mutationFn: (updatedData: BlogFormData) =>
      serverApiRequest("patch", `/blogs/${blogId}`, {
        data: updatedData,
      }),
    onSuccess: async (data) => {
      const oldOpenGraphImage = blog?.openGraphImageUrl;
      const newOpenGraphImage = data.data.openGraphImageUrl;
      if (oldOpenGraphImage && newOpenGraphImage !== oldOpenGraphImage) {
        try {
          await deleteImages([oldOpenGraphImage]);
        } catch (error) {
          toast.error(String(error));
        }
      }

      const oldImages = blog?.imageUrls || [];
      const newImages = data.data.imageUrls || [];
      const removedImages = oldImages.filter(
        (img: string) => !newImages.includes(img)
      );

      if (removedImages.length > 0) {
        try {
          await deleteImages(removedImages);
        } catch (error) {
          toast.error(String(error));
        }
      }

      toast.success("Blog updated successfully");
      qc.invalidateQueries({ queryKey: [QK.BLOG] });
    },
    onError: (error) => toast.error(String(error) || "Blog update failed!"),
  });

  // Add this mutation hook near other query hooks
  const { mutateAsync: uploadFile, isPending: isPendingUploadFile } =
    useMutation({
      mutationFn: async (file: File) => {
        const buffer = Array.from(new Uint8Array(await file.arrayBuffer()));
        const res = await fetch("/api/cloudinary/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ buffer, filename: file.name }),
        });
        if (!res.ok) throw new Error("Upload failed");
        return (await res.json()).url;
      },
    });

  const onFormSubmit = async (formData: BlogFormData) => {
    try {
      // Handle file uploads using mutation
      const uploadedUrls = formData.files?.length
        ? await Promise.all(formData.files.map((file) => uploadFile(file)))
        : [];

        const openGraphUploadedUrl = formData.openGraphImageFile
        ? await uploadFile(formData.openGraphImageFile)
        : "";


      // Prepare image URLs
      const existingUrls = Array.isArray(formData.imageUrls)
        ? formData.imageUrls
        : formData.imageUrls
        ? [formData.imageUrls]
        : [];

      // Update product with all images
      const updatedData = {
        ...formData,
        imageUrls: [...existingUrls, ...uploadedUrls],
        openGraphImageUrl: openGraphUploadedUrl ? openGraphUploadedUrl : blog.openGraphImageUrl,
      };   

      updateBlog(updatedData);
    } catch (err) {
      toast.error("Image upload failed: " + (err as Error).message);
    }
  };

  if (isLoadingBlog) return <SkeletonCardBlogUpdate />;
  if (isErrorBlog) return <ErrorResultMessage />;
  if (!blog) return notFound();

  const defaultValue = {
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    author: blog?.author?._id || blog?.author || "",
    imageUrls: blog?.imageUrls || "",
    treatment: blog?.treatment?._id || blog?.treatment || "",
    tags: blog?.tags || [],
    isPublished: blog?.isPublished || false,
    publishedAt: blog?.publishedAt ? new Date(blog.publishedAt) : undefined,
    metaTitle: blog?.metaTitle || "",
    metaDescription: blog?.metaDescription || "",
    openGraphImageUrl: blog?.openGraphImageUrl || "",
    seoKeywords: blog?.seoKeywords || [],
  };

  const FORM_ID = UPDATE_BLOG_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Update Blog</h2>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            disabled={
              isPendingBlogUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
          >
            <Link href="/blogs">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={
              isPendingBlogUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
            disabled={
              isPendingBlogUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <BlogForm
          formId={FORM_ID}
          defaultValue={defaultValue}
          onSubmit={onFormSubmit}
        />
      </ScrollArea>
    </div>
  );
}

export function SkeletonCardBlogUpdate() {
  return (
    <div className="flex flex-col space-y-2 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12" />
        </div>
      ))}
    </div>
  );
}
