"use client";

// Changed import from TreatmentForm to UserForm and TreatmentFormData to UserFormData
import { Button } from "@/components/ui/button";
import { ErrorResultMessage } from "@/components/ui/data-result-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import UserForm, { UserFormData } from "@/components/users/form";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";

const UPDATE_USER_MUTATION_KEY = QK.USER + "_EDIT";

export default function EditPage({ userId }: { userId: string }) {
  const qc = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: [QK.USER, { id: userId }],
    queryFn: () => serverApiRequest("get", `/users/get-by-id/${userId}`),
    enabled: !!userId,
    select: (data) => data.data,
  });

  const {
    mutate: updateUser,
    isPending: isPendingUserUpdate,
  } = useMutation({
    mutationKey: [UPDATE_USER_MUTATION_KEY],
    mutationFn: (updatedData: UserFormData) =>
      serverApiRequest("patch", `/users/${userId}`, {  // Changed from /admins to /users
        data: updatedData,
      }),
    onSuccess: async () => {
      toast.success("User updated successfully");
      qc.invalidateQueries({ queryKey: [QK.USER] });
    },
    onError: (error) =>
      toast.error(String(error) || "User update failed!"),
  });

  const onFormSubmit = async (formData: UserFormData) => {
    updateUser(formData);
  };

  if (isLoadingUser) return <SkeletonCardUserUpdate />;
  if (isErrorUser) return <ErrorResultMessage />;
  if (!user) return notFound();

  const defaultValue = {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "admin",
  };

  const FORM_ID = UPDATE_USER_MUTATION_KEY;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Update User</h2>
        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPendingUserUpdate}>
            <Link href="/users">Cancel</Link>
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={isPendingUserUpdate}
            disabled={isPendingUserUpdate}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <UserForm
          formId={FORM_ID}
          defaultValue={defaultValue}
          onSubmit={onFormSubmit}
        />
      </ScrollArea>
    </div>
  );
}

export function SkeletonCardUserUpdate() {
  return (
    <div className="flex flex-col space-y-2 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12" />
        </div>
      ))}
    </div>
  );
}
