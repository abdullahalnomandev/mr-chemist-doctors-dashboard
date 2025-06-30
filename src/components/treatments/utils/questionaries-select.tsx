"use client";

import { TreatmentFormData } from "@/components/treatments/form";
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
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

export function QuestionariesSelect() {
  const form = useFormContext<TreatmentFormData>();

  // Add this function outside the component
  async function fetchQuestionnaires() {
    const variables = {
      pagination: {
        page: 1,
        pageSize: 10,
      },
      options: {},
    };

    const query = `
          query GetQuestionnaires($pagination: Pagination, $options: QuestionnairesQueryOptions) {
              questionnaires(pagination: $pagination, options: $options) {
                pageInfo {
                  page
                  pageSize
                  hasMore
                }
                data {
                  id
                  token
                  title
                }
              }
            }
        `;

    const response = await fetch("https://open.semble.io/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": process.env.NEXT_PUBLIC_SEMBLE_AUTH_TOKEN || "",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0]?.message || "GraphQL Error");
    }

    return data.data.questionnaires.data;
  }

  // In your component, replace the useQuery with:
  const {
    data: consulations,
    isLoading: isLoadingQuestionnaires,
    isError: isErrorQuestionnaires,
  } = useQuery({
    queryKey: ["questionnaires"],
    queryFn: fetchQuestionnaires,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
  });
  if (isErrorQuestionnaires) {
    return <FormMessage>Error loading treatments</FormMessage>;
  }

  return (
    <FormField
      control={form.control}
      name='questionsId'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Consultation</FormLabel>
          {isLoadingQuestionnaires ? (
            <Skeleton className='mt-1 rounded-none h-10 w-full' />
          ) : (
            <FormControl>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select consultation' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {consulations?.map(
                    (consulation: {
                      id: string;
                      title: string;
                      token: string;
                    }) => (
                      <SelectItem
                        key={consulation.id}
                        value={consulation.token}>
                        {consulation.title}
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
