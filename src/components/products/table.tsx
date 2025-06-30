"use client";

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
// import { DotNestedKeys, EnsuredType, InboxStatus } from "@/lib/types";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  treatment: {
    _id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    logoUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  isActive: boolean;
  imageUrls?: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
};

const QUERY_KEY = QK.PRODUCT;
const DELETE_MUTATION_KEY = QK.PRODUCT + "_DELETE";
const DELETE_MULTIPLE_MUTATION_KEY = QK.PRODUCT + "_DELETE_MULTIPLE";

const sortingKeys = {
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

// For now its not working. We set the keys in database.
const searchKeys = ["name", "createdAt"];

export default function ProductsTable() {
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
      serverApiRequest("get", "/products", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          sort: sortingFormatted[0],
          searchTerm: searchValue,
        },
      }),
    placeholderData: keepPreviousData, // Prevent flashing of empty data while loading
    select: ({ data, meta }) => ({
      data: data,
      total: meta?.total,
      totalUnfiltered: meta?.totalUnfiltered,
    }),
  });

  const { mutate: deleteProduct } = useMutation({
    mutationKey: [DELETE_MUTATION_KEY],
    mutationFn: (id: string) => serverApiRequest("delete", `/products/${id}`),
    onSuccess: () => toast.success("Product deleted successfully"),
    onError: () => toast.error("Product deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutate: deleteProducts } = useMutation({
    mutationKey: [DELETE_MULTIPLE_MUTATION_KEY],
    mutationFn: (ids: string[]) =>
      serverApiRequest("post", `/products/batch-delete`, {
        data: { ids: ids },
      }),
    onSuccess: () => toast.success("Products deleted successfully"),
    onError: () => toast.error("Products deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  type QueryResponse = Product;

  const qc = useQueryClient();

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  const onBulkDelete = (rows: Product[], resetSelection: () => void) => {
    deleteProducts(
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

    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrls = row.original.imageUrls;
        return (
          imageUrls?.[0] ?
          <Image
            src={imageUrls[0] || ""}
            alt="product_img"
            width={50}
            height={50}
          /> : "-"
        );
      },
      enableSorting: false,
    },

    ca("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate font-medium">{getValue()}</span>
      ),
    }),

    ca("slug", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate font-medium">{getValue()}</span>
      ),
      enableSorting: false,
    }),

    ca("basePrice", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ getValue }) => (
        <span className="max-w-[300px] truncate font-medium">
          ${getValue().toFixed(2)}
        </span>
      ),
    }),

    ca("treatment.name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Treatment" />
      ),
      cell: ({ getValue }) => (
        <span className="max-w-[300px] truncate font-medium">{getValue()}</span>
      ),
    }),

    ca("description", {
      header: "Description",
      cell: ({ getValue }) => (
        <span className="max-w-[300px] truncate font-medium block">
          {getValue()}
        </span>
      ),
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
    }),

    ca("updatedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Update Date" />
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
            delete: { onDelete: () => deleteProduct(row.original?._id) },
            edit: { path: `/products/${row.original?._id}` },
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
          key="channelSearch"
          placeholder="Search for a data"
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
