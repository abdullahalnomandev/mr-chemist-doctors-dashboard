"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserForm, { UserFormData } from "@/components/users/form"
import { QK } from "@/lib/query-keys"
import { serverApiRequest } from "@/lib/utils-server"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const CREATE_USER_MUTATION_KEY = QK.USER + "_CREATE" || "USER_CREATE"

export default function CreateUserPage() {
  const router = useRouter()
  const qc = useQueryClient()

  const { mutate: createUser, isPending } = useMutation({
    mutationKey: [CREATE_USER_MUTATION_KEY],
    mutationFn: (variables: UserFormData) => serverApiRequest("post", "/users/create-user", { data: variables }),
    onSuccess: () => {
      toast.success("User created successfully")
      qc.invalidateQueries({ queryKey: [QK.USER || "USER"] })
      router.push("/users")
    },
    onError: (error) => {
      toast.error(error.message || "User creation failed!")
    },
  })

  const onFormSubmit = async (formData: UserFormData) => {
    createUser(formData)
  }

  const FORM_ID = CREATE_USER_MUTATION_KEY

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Add User</h2>

        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPending}>
            <Link href="/users">Cancel</Link>
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending} disabled={isPending}>
            Save User
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <UserForm formId={FORM_ID} onSubmit={onFormSubmit} />
      </ScrollArea>
    </div>
  )
}
