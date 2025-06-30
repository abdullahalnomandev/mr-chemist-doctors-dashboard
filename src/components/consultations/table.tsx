"use client";

import { EmptyResultMessage } from "@/components/ui/data-result-message";
import DataTable, {
  useTablePagination,
} from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
// import { DotNestedKeys, EnsuredType, InboxStatus } from "@/lib/types";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Link from "next/link";

type Consultation = {
  id: string;
  token: string;
  title: string;
  createdAt: string;
};

export default function ConsultationsTable() {
  const { pagination, onPaginationChange } = useTablePagination();
  const { pageIndex, pageSize } = pagination;

  // Add this function outside the component
  async function fetchQuestionnaires() {
    const variables = {
      pagination: {
        page: pageIndex,
        pageSize: pageSize,
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
                    createdAt
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
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["QUESTIONAIRES", { pageIndex, pageSize }],
    queryFn: fetchQuestionnaires,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
  });

  type QueryResponse = Consultation;

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  // Define table columns
  const columns = [
    ca("title", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[300px] truncate font-medium">
          <Link
            className="hover:underline hover:text-primary"
            href={`https://questionnaire.semble.io/${row.original.token}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.original.title}
          </Link>
        </span>
      ),
      enableSorting: false,
    }),

    // createdAt column
    ca("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Create Date" />
      ),
      cell: ({ getValue }) => {
        const date = getValue();
        const formatDate = (date: Date | string) =>
          format(date, "dd MMM yyyy").toUpperCase();
        return (
          <div className="whitespace-nowrap">
            {date ? formatDate(date) : "-"}
          </div>
        );
      },
      enableSorting: false,
    }),
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <span>
          <Link
            className="text-primary flex items-center gap-1"
            href={`https://questionnaire.semble.io/${row.original.token}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { noStretch: true },
    },
  ] as ColumnDef<QueryResponse>[];

  // const totalRows = data?.totalUnfiltered;

  if (!data?.length && !isLoading) return <EmptyResultMessage />;

  return (
    <DataTable
      isLoading={isLoading || isFetching}
      isError={isError}
      data={data}
      columns={columns}
      // actions={{ onBulkDelete }}
      // totalRows={data?.total}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      // sorting={sorting}
      // onSortingChange={onSortingChange}
    />
  );
}
