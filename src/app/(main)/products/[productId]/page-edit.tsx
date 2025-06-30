"use client";

import ProductForm, { ProductFormData } from "@/components/products/form";
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

const UPDATE_PRODUCT_MUTATION_KEY = QK.PRODUCT + "_EDIT";

export default function EditPage({ productId }: { productId: string }) {
  const qc = useQueryClient();

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = useQuery({
    queryKey: [QK.PRODUCT, { id: productId }],
    queryFn: () => serverApiRequest("get", `/products/id/${productId}`),
    enabled: !!productId,
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

  const { mutate: updateProduct, isPending: isPendingProductUpdate } =
    useMutation({
      mutationKey: [UPDATE_PRODUCT_MUTATION_KEY],
      mutationFn: (updatedData: ProductFormData) =>
        serverApiRequest("patch", `/products/${productId}`, {
          data: updatedData,
        }),
      onSuccess: async (data) => {

        const oldOpenGraphImage = product?.openGraphImageUrl;
        const newOpenGraphImage = data.data.openGraphImageUrl;
        if (oldOpenGraphImage && newOpenGraphImage !== oldOpenGraphImage) {
          try {
            await deleteImages([oldOpenGraphImage]);
          } catch (error) {
            toast.error(String(error));
          }
        }

        const oldImages = product?.imageUrls || [];
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

        toast.success("Product updated successfully");
        qc.invalidateQueries({ queryKey: [QK.PRODUCT] });
      },
      onError: (error) =>
        toast.error(String(error) || "Product update failed!"),
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

  const onFormSubmit = async (formData: ProductFormData) => {
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
        openGraphImageUrl: openGraphUploadedUrl ? openGraphUploadedUrl : product.openGraphImageUrl,
        files: undefined,
      };

      updateProduct(updatedData);
    } catch (err) {
      toast.error("Image upload failed: " + (err as Error).message);
    }
  };

  if (isLoadingProduct) return <SkeletonCardProductUpdate />;
  if (isErrorProduct) return <ErrorResultMessage />;
  if (!product) return notFound();

  const defaultValue = {
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    basePrice: product?.basePrice || 0,
    variants: product?.variants || [
      { type: "weight", value: "", unit: "", price: 0, stock: 0 },
    ],
    imageUrls: product?.imageUrls || "",
    treatment: product?.treatment._id || "",
    needConsultation: product?.needConsultation || false,
    consultationId: product?.consultationId || "",
    keyPoints: product?.keyPoints || [""],
    isActive: product?.isActive || false,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    openGraphImageUrl: product?.openGraphImageUrl || "",
    seoKeywords: product?.seoKeywords || [],
  };

  const FORM_ID = UPDATE_PRODUCT_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Update Product</h2>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            disabled={
              isPendingProductUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
          >
            <Link href="/products">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={
              isPendingProductUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
            disabled={
              isPendingProductUpdate ||
              isPendingUploadFile ||
              isPendingDeleteImages
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <ProductForm
          formId={FORM_ID}
          defaultValue={defaultValue}
          onSubmit={onFormSubmit}
        />
      </ScrollArea>
    </div>
  );
}

export function SkeletonCardProductUpdate() {
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
