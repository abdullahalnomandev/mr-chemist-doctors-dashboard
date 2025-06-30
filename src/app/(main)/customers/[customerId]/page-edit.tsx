"use client";

// Changed import from TreatmentForm to UserForm and TreatmentFormData to UserFormData
import { Button } from "@/components/ui/button";
import { ErrorResultMessage } from "@/components/ui/data-result-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerForm, { CustomerFormData } from "@/components/customers/form";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";

const UPDATE_CUSTOMER_MUTATION_KEY = QK.CUSTOMER + "_EDIT";

export default function EditPage({ customerId }: { customerId: string }) {
  const qc = useQueryClient();

  const {
    data: customer,
    isLoading: isLoadingCustomer,
    isError: isErrorCustomer,
  } = useQuery({
    queryKey: [QK.CUSTOMER, { id: customerId }],
    queryFn: () => serverApiRequest("get", `/customers/${customerId}`),
    enabled: !!customerId,
    select: (data) => data.data,
  });

  const {
    mutate: updateCustomer,
    isPending: isPendingCustomerUpdate,
  } = useMutation({
    mutationKey: [UPDATE_CUSTOMER_MUTATION_KEY],
    mutationFn: (updatedData: CustomerFormData) =>
      serverApiRequest("patch", `/customers/${customerId}`, {
        data: updatedData,
      }),
    onSuccess: async () => {
      toast.success("Customer updated successfully");
      qc.invalidateQueries({ queryKey: [QK.CUSTOMER] });
    },
    onError: (error) =>
      toast.error(String(error) || "Customer update failed!"),
  });

  const onFormSubmit = async (formData: CustomerFormData) => {
    updateCustomer(formData);
  };

  if (isLoadingCustomer) return <SkeletonCardCustomerUpdate />;
  if (isErrorCustomer) return <ErrorResultMessage />;
  if (!customer) return notFound();

  const defaultValue = {
    name: {
      firstName: customer?.name?.firstName || "",
      middleName: customer?.name?.middleName || "",
      lastName: customer?.name?.lastName || "",
    },
    email: customer?.email || "",
    contactNo: customer?.contactNo || "",
    emergencyContactNo: customer?.emergencyContactNo || "",
    gender: customer?.gender || undefined,
    dateOfBirth: customer?.dateOfBirth || "",
    bloodGroup: customer?.bloodGroup || "",
    presentAddress: customer?.presentAddress || "",
    permanentAddress: customer?.permanentAddress || "",
  };

  const FORM_ID = UPDATE_CUSTOMER_MUTATION_KEY;
return <div>asdsdad</div>
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Update Customer</h2>
        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPendingCustomerUpdate}>
            <Link href="/customers">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={isPendingCustomerUpdate}
            disabled={isPendingCustomerUpdate}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <CustomerForm
          formId={FORM_ID}
          defaultValue={defaultValue}
          onSubmit={onFormSubmit}
        />
      </ScrollArea>
    </div>
  );
}

export function SkeletonCardCustomerUpdate() {
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
