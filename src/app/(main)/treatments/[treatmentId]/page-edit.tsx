"use client";

import TreatmentForm, { TreatmentFormData } from "@/components/treatments/form";
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

const UPDATE_TREATMENT_MUTATION_KEY = QK.TREATMENT + "_EDIT";

export default function EditPage({ treatmentId }: { treatmentId: string }) {
  const qc = useQueryClient();

  const {
    data: treatment,
    isLoading: isLoadingTreatment,
    isError: isErrorTreatment,
  } = useQuery({
    queryKey: [QK.TREATMENT, { id: treatmentId }],
    queryFn: () => serverApiRequest("get", `/treatments/id/${treatmentId}`),
    enabled: !!treatmentId,
    select: (data) => data.data,
  });

  const { mutateAsync: deleteLogo, isPending: isPendingDeleteLogo } =
    useMutation({
      mutationFn: async (url: string) => {
        const response = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: [url] }),
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error("Logo couldn't be deleted from storage");
        }
        return result;
      },
    });

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

  const { mutate: updateTreatment, isPending: isPendingTreatmentUpdate } =
    useMutation({
      mutationKey: [UPDATE_TREATMENT_MUTATION_KEY],
      mutationFn: (updatedData: TreatmentFormData) =>
        serverApiRequest("patch", `/treatments/${treatmentId}`, {
          data: updatedData,
        }),
      onSuccess: async (data) => {
        const oldLogo = treatment?.logoUrl;
        const newLogo = data.data.logoUrl;

        if (oldLogo && oldLogo !== newLogo) {
          try {
            await deleteLogo(oldLogo);
          } catch (error) {
            toast.error(String(error));
          }
        }

        toast.success("Treatment updated successfully");
        qc.invalidateQueries({ queryKey: [QK.TREATMENT] });
      },
      onError: (error) =>
        toast.error(String(error) || "Treatment update failed!"),
    });

  const onFormSubmit = async (formData: TreatmentFormData) => {
    try {
      const uploadedUrl = formData.file ? await uploadFile(formData.file) : null
      // Update treatment with the logo URL
      const updatedData = {
        ...formData,
        logoUrl: uploadedUrl,
        file: undefined, // Remove file from payload
      };

      updateTreatment(updatedData);
    } catch (err) {
      toast.error("Logo upload failed: " + (err as Error).message);
    }
  };

  if (isLoadingTreatment) return <SkeletonCardTreatmentUpdate />;
  if (isErrorTreatment) return <ErrorResultMessage />;
  if (!treatment) return notFound();

  const defaultValue = {
    name: treatment?.name,
    slug: treatment?.slug,
    description: treatment?.description,
    isActive: treatment?.isActive,
    logoUrl: treatment?.logoUrl || "",
  };

  const FORM_ID = UPDATE_TREATMENT_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Update Treatment</h2>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            disabled={
              isPendingTreatmentUpdate ||
              isPendingUploadFile ||
              isPendingDeleteLogo
            }
          >
            <Link href="/treatments">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={
              isPendingTreatmentUpdate ||
              isPendingUploadFile ||
              isPendingDeleteLogo
            }
            disabled={
              isPendingTreatmentUpdate ||
              isPendingUploadFile ||
              isPendingDeleteLogo
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <TreatmentForm
          formId={FORM_ID}
          defaultValue={defaultValue}
          onSubmit={onFormSubmit}
        />
      </ScrollArea>
    </div>
  );
}

export function SkeletonCardTreatmentUpdate() {
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
