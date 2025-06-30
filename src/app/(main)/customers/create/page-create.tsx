"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import CustomerForm, { CustomerFormData } from "@/components/customers/form"
import { QK } from "@/lib/query-keys"
import { serverApiRequest } from "@/lib/utils-server"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const CREATE_CUSTOMER_MUTATION_KEY = QK.CUSTOMER + "_CREATE" || "CUSTOMER_CREATE"

export default function CreateCustomerPage() {
  const router = useRouter()
  const qc = useQueryClient()

  const { mutate: createCustomer, isPending } = useMutation({
    mutationKey: [CREATE_CUSTOMER_MUTATION_KEY],
    mutationFn: (variables: CustomerFormData) => 
      serverApiRequest("post", "/customers", { data: variables }),
    onSuccess: () => {
      toast.success("Customer created successfully")
      qc.invalidateQueries({ queryKey: [QK.CUSTOMER || "CUSTOMER"] })
      router.push("/customers")
    },
    onError: (error) => {
      toast.error(error.message || "Customer creation failed!")
    },
  })

  const onFormSubmit = async (formData: CustomerFormData) => {
    createCustomer(formData)
  }

  const FORM_ID = CREATE_CUSTOMER_MUTATION_KEY

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Add Customer</h2>

        <div className="flex gap-2">
          <Button asChild variant="secondary" disabled={isPending}>
            <Link href="/customers">Cancel</Link>
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending} disabled={isPending}>
            Save Customer
          </Button>
        </div>
      </div>
      <ScrollArea className="h-20 grow">
        <CustomerForm formId={FORM_ID} onSubmit={onFormSubmit} />
      </ScrollArea>
    </div>
  )
}
