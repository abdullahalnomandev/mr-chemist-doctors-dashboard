"use client";

import BlogForm, { BlogFormData } from "@/components/blogs/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CREATE_BLOG_MUTATION_KEY = QK.BLOG + "_CREATE";

export default function CreatePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: session } = useSession();

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

  const { mutate: createBlog, isPending: isPendingProductCreation } =
    useMutation({
      mutationKey: [CREATE_BLOG_MUTATION_KEY],
      mutationFn: (variables: BlogFormData) =>
        serverApiRequest("post", "/blogs/create", { data: variables }),
      onSuccess: () => {
        toast.success("Blog created successfully");
        qc.invalidateQueries({ queryKey: [QK.BLOG] });
        router.push("/blogs");
      },
      onError: (error) => {
        toast.error(error.message || "Blog creation failed!");
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

      // Create product with all images
      const updatedData = {
        ...formData,
        imageUrls: [...existingUrls, ...uploadedUrls],
        openGraphImageUrl: openGraphUploadedUrl,
        author: session?.user._id,
      };

      createBlog(updatedData);
    } catch (err) {
      toast.error("Image upload failed: " + (err as Error).message);
    }
  };

  const FORM_ID = CREATE_BLOG_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Add Blog</h2>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            disabled={isPendingProductCreation || isPendingUploadFile}
          >
            <Link href="/blogs">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={isPendingProductCreation || isPendingUploadFile}
            disabled={isPendingProductCreation || isPendingUploadFile}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <BlogForm formId={FORM_ID} onSubmit={onFormSubmit} />
      </ScrollArea>
    </div>
  );
}
