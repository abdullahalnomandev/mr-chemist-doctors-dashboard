"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { EmptyResultMessage } from "@/components/ui/data-result-message";
import DataTable, {
  useTablePagination,
  useTableSorting,
} from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
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
import Image from "next/image";
import { toast } from "sonner";

type Customer = {
  _id: string;
  id: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  email: string;
  profileImg?: string;
  contactNo?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  presentAddress?: string;
  permanentAddress?: string;
  createdAt?: string;
  updatedAt?: string;
};

const QUERY_KEY = QK.CUSTOMER || "CUSTOMER";
const DELETE_MUTATION_KEY = QK.CUSTOMER + "_DELETE" || "CUSTOMER_DELETE";
const DELETE_MULTIPLE_MUTATION_KEY =
  QK.CUSTOMER + "_DELETE_MULTIPLE" || "CUSTOMER_DELETE_MULTIPLE";

const sortingKeys = {
  name: "name.firstName",
  email: "email",
  contactNo: "contactNo",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

const searchKeys = ["name.firstName", "name.lastName", "email", "contactNo"];

export default function CustomersTable() {
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
      serverApiRequest("get", "/customers", {
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

  const { mutate: deleteCustomer } = useMutation({
    mutationKey: [DELETE_MUTATION_KEY],
    mutationFn: (id: string) => serverApiRequest("delete", `/customers/${id}`),
    onSuccess: () => toast.success("Customer deleted successfully"),
    onError: () => toast.error("Customer deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutate: deleteCustomers } = useMutation({
    mutationKey: [DELETE_MULTIPLE_MUTATION_KEY],
    mutationFn: (ids: string[]) =>
      serverApiRequest("post", `/customers/batch-delete`, {
        data: { ids: ids },
      }),
    onSuccess: () => toast.success("Customers deleted successfully"),
    onError: () => toast.error("Customers deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  type QueryResponse = Customer;

  const qc = useQueryClient();

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  const onBulkDelete = (rows: Customer[], resetSelection: () => void) => {
    deleteCustomers(
      rows.map((row) => row._id),
      { onSuccess: () => resetSelection() }
    );
  };

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
    {
      id: "profileImg",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.profileImg;
        return imageUrl ? (
          <Image
            src={imageUrl || ""}
            alt="customer_img"
            width={50}
            height={50}
          />
        ) : (
          "-"
        );
      },
    },
    {
      id: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">
          {`${row.original.name.firstName} ${row.original.name.lastName}`}
        </span>
      ),
    },
    ca("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">{row.original.email}</span>
      ),
    }),
    ca("contactNo", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[150px] truncate">
          {row.original.contactNo || "-"}
        </span>
      ),
    }),
    ca("gender", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.original.gender || "-"}</span>
      ),
    }),
    // ca("createdAt", {
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Created" />
    //   ),
    //   cell: ({ row }) => (
    //     <span className="whitespace-nowrap">
    //       {row.original.createdAt
    //         ? format(new Date(row.original.createdAt), "dd MMM yyyy")
    //         : "-"}
    //     </span>
    //   ),
    // }),
    // {
    //   id: "action",
    //   header: "Action",
    //   cell: ({ row }) => (
    //     <DataTableRowActions
    //       actions={{
    //         delete: { onDelete: () => deleteCustomer(row.original._id) },
    //         edit: { path: `/customers/${row.original._id}` },
    //       }}
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   meta: { noStretch: true },
    // },
  ] as ColumnDef<QueryResponse>[];

  const totalRows = data?.totalUnfiltered;

  if (!totalRows && !isLoading) return <EmptyResultMessage />;

  return (
    <>
      {!!totalRows && (
        <SearchInput
          key="customerSearch"
          placeholder="Search customers by name, email, or contact"
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
