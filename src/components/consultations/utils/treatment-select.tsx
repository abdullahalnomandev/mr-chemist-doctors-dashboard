"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { ConsultationFormData } from "./types";

export function TreatmentSelect() {
  const form = useFormContext<ConsultationFormData>();

  const {
    data: treatments,
    isLoading: isLoadingTreatment,
    isError: isErrorTreatment,
  } = useQuery({
    queryKey: [QK.TREATMENT, "LIST"],
    queryFn: () => serverApiRequest("get", `/treatments`),
    select: (data) =>
      data.data.map((treatment: { _id: string; name: string }) => ({
        _id: treatment._id,
        name: treatment.name,
      })),
  });

  if (isErrorTreatment) {
    return <FormMessage>Error loading treatments</FormMessage>;
  }

  return (
    <FormField
      control={form.control}
      name='treatment'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Treatment</FormLabel>
          {isLoadingTreatment ? (
            <Skeleton className='mt-1 rounded-none h-10 w-full' />
          ) : (
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select treatment' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treatments?.map(
                    (treatment: { _id: string; name: string }) => (
                      <SelectItem key={treatment._id} value={treatment._id}>
                        {treatment.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
