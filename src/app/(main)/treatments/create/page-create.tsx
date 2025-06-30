"use client";

import TreatmentForm, { TreatmentFormData } from "@/components/treatments/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CREATE_TREATMENT_MUTATION_KEY = QK.TREATMENT + "_CREATE";

export default function CreatePage() {
  const router = useRouter();
  const qc = useQueryClient();

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

  const { mutate: createTreatment, isPending: isPendingTreatmentCreation } =
    useMutation({
      mutationKey: [CREATE_TREATMENT_MUTATION_KEY],
      mutationFn: (variables: TreatmentFormData) =>
        serverApiRequest("post", "/treatments/create", { data: variables }),
      onSuccess: () => {
        toast.success("Treatment created successfully");
        qc.invalidateQueries({ queryKey: [QK.TREATMENT] });
        router.push("/treatments");
      },
      onError: (error) => {
        toast.error(error.message || "Treatment creation failed!");
      },
    });

  const onFormSubmit = async (formData: TreatmentFormData) => {
    try {
      const uploadedUrl = formData.file
        ? await uploadFile(formData.file)
        : null;
      const treatmentData = {
        ...formData,
        logoUrl: uploadedUrl,
        file: undefined, // Remove file from payload
      };

      createTreatment(treatmentData);
    } catch (err) {
      toast.error("Logo upload failed: " + (err as Error).message);
    }
  };

  const FORM_ID = CREATE_TREATMENT_MUTATION_KEY;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold tracking-tight'>Add Treatment</h2>

        <div className='flex gap-2'>
          <Button
            asChild
            variant='secondary'
            disabled={isPendingTreatmentCreation || isPendingUploadFile}>
            <Link href='/treatments'>Cancel</Link>
          </Button>
          <Button
            type='submit'
            form={FORM_ID}
            loading={isPendingTreatmentCreation || isPendingUploadFile}
            disabled={isPendingTreatmentCreation || isPendingUploadFile}>
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className='h-20 grow'>
        <TreatmentForm formId={FORM_ID} onSubmit={onFormSubmit} />
      </ScrollArea>
    </div>
  );
}
