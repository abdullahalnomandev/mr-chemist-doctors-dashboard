"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyResultMessage } from "@/components/ui/data-result-message";
import DataTable, {
  useTablePagination,
  useTableSorting,
} from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import DataTableRowActions from "@/components/ui/data-table/data-table-row-actions";
import { SearchInput } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";

type User = {
  _id: string;
  id: string,
  name?: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  createdAt?: string;
  updatedAt?: string;
};

const QUERY_KEY = QK.USER || "USER";
const DELETE_MUTATION_KEY = QK.USER + "_DELETE" || "USER_DELETE";
const DELETE_MULTIPLE_MUTATION_KEY =
  QK.USER + "_DELETE_MULTIPLE" || "USER_DELETE_MULTIPLE";

const sortingKeys = {
  email: "email",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

const searchKeys = [
  "email",
  "role"
];

export default function UsersTable() {
  const { pagination, onPaginationChange } = useTablePagination();
  const { pageIndex, pageSize } = pagination;
  const { sortingFormatted, sorting, onSortingChange } = useTableSorting({
    sortingKeys,
  });
  const { searchValue, onSearch } = useSearch({ searchKeys });

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [
      QUERY_KEY,
      "LIST",
      {
        pageIndex,
        pageSize,
        searchTerm: searchValue,
        sortingFormatted,
      },
    ],
    queryFn: () =>
      serverApiRequest("get", "/users/get/non-customers", {  // Updated endpoint
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          sort: sortingFormatted[0],
          searchTerm: searchValue,
        },
      }),
    placeholderData: keepPreviousData,
    select: ({ data, meta }) => ({
      data: data,
      total: meta?.total,
      totalUnfiltered: meta?.totalUnfiltered,
    }),
  });

  const { mutate: deleteUser } = useMutation({
    mutationKey: [DELETE_MUTATION_KEY],
    mutationFn: (id: string) => serverApiRequest("delete", `/users/${id}`),
    onSuccess: () => toast.success("User deleted successfully"),
    onError: () => toast.error("User deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutate: deleteUsers } = useMutation({
    mutationKey: [DELETE_MULTIPLE_MUTATION_KEY],
    mutationFn: (ids: string[]) =>
      serverApiRequest("post", `/users/batch-delete`, {
        data: { ids: ids },
      }),
    onSuccess: () => toast.success("Users deleted successfully"),
    onError: () => toast.error("Users deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  type QueryResponse = User;

  const qc = useQueryClient();

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  const onBulkDelete = (rows: User[], resetSelection: () => void) => {
    deleteUsers(
      rows.map((row) => row._id),
      { onSuccess: () => resetSelection() }
    );
  };

  // Define table columns
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { noStretch: true, checkbox: true },
    },
    ca("id", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue()}</span>
      ),
    }),

    ca("name", {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ getValue }) => (
        <span className="max-w-[200px] truncate">{getValue() || "-"}</span>
      ),
    }),

    ca("email", {
      id: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">{row.original.email}</span>
      ),
    }),

    ca("role", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ getValue }) => {
        const role = getValue() as "admin" | "editor";
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    }),




    // createdAt column
    ca("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created Date" />
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
    }),

    ca("updatedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated Date" />
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
    }),

    // Actions column
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <DataTableRowActions
          actions={{
            delete: { onDelete: () => deleteUser(row.original._id) },
            edit: { path: `/users/${row.original._id}` }, // Updated path
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { noStretch: true },
    },
  ] as ColumnDef<QueryResponse>[];

  const totalRows = data?.totalUnfiltered;

  if (!totalRows && !isLoading) return <EmptyResultMessage />;

  return (
    <>
      {!!totalRows && (
        <SearchInput
          key="userSearch"
          placeholder="Search admins by name, email, or role"
          containerClassName="w-96"
          onChange={onSearch}
        />
      )}
      <DataTable
        isLoading={isLoading || isFetching}
        isError={isError}
        data={data?.data}
        columns={columns}
        actions={{ onBulkDelete }}
        totalRows={data?.total}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
    </>
  );
}
