"use client";

import ConsultationForm from "@/components/consultations/form";
import { ConsultationFormData } from "@/components/consultations/utils/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CREATE_CONSULTATION_MUTATION_KEY = QK.CONSULTATION + "_CREATE"; // Update mutation key

export default function CreatePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const {
    mutate: createConsultation,
    isPending: isPendingConsultationCreation,
  } = useMutation({
    mutationKey: [CREATE_CONSULTATION_MUTATION_KEY],
    mutationFn: (consultationData: ConsultationFormData) =>
      serverApiRequest("post", "/consultations/create", {
        data: consultationData,
      }), // Update API endpoint
    onSuccess: () => {
      toast.success("Consultation created successfully");
      qc.invalidateQueries({ queryKey: [QK.CONSULTATION] });
      router.push("/consultations");
    },
    onError: (error) => {
      toast.error(error.message || "Consultation creation failed!");
    },
  });

  const onFormSubmit = async (formData: ConsultationFormData) => {
    createConsultation(formData);
  };

  const FORM_ID = CREATE_CONSULTATION_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Add Consultation</h2>

        <div className="flex gap-2">
          <Button
            asChild
            variant="secondary"
            disabled={isPendingConsultationCreation}
          >
            <Link href="/consultations">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={isPendingConsultationCreation}
            disabled={isPendingConsultationCreation}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow mt-4">
        <ConsultationForm formId={FORM_ID} onSubmit={onFormSubmit} />
      </ScrollArea>
    </div>
  );
}
