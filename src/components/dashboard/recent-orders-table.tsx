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
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import DataTableRowActions from "../ui/data-table/data-table-row-actions";

type OrderItem = {
  product: {
    _id: string;
    imageUrls: string[];
    name: string;
  } | null;
  name: string;
  variant: string;
  productBasePrice: number;
  quantity: number;
  type: string;
  unit: string;
  price: number;
  value: string;
  _id: string;
};

type Order = {
  _id: string;
  orderId: string;
  royalMailStatus: string;
  customer: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  couponCode: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  __v: number;
  orderIdentifier: number;
};

const QUERY_KEY = QK.ORDER;
const DELETE_MUTATION_KEY = QK.ORDER + "_DELETE";
const DELETE_MULTIPLE_MUTATION_KEY = QK.ORDER + "_DELETE_MULTIPLE";

const sortingKeys = {
  orderId: "orderId",
  orderStatus: "orderStatus",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  totalAmount: "totalAmount",
};

const searchKeys = ["orderId", "orderStatus", "paymentStatus"];

export default function RecentOrdersTable() {
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
      serverApiRequest("get", "/orders", {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          sort: sortingFormatted[0],
          searchTerm: searchValue,
        },
      }),
    placeholderData: keepPreviousData,
    select: ({ data }) => ({
      data: data.result,
      total: data.meta?.total,
      totalUnfiltered: data.meta?.totalUnfiltered,
    }),
  });

  // const { mutate: deleteOrder } = useMutation({
  //   mutationKey: [DELETE_MUTATION_KEY],
  //   mutationFn: (id: string) => serverApiRequest("delete", `/orders/${id}`),
  //   onSuccess: () => toast.success("Order deleted successfully"),
  //   onError: () => toast.error("Order deletion failed"),
  //   onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  // });

  const deleteOrder = () => {
    toast.error("Feature not available!");
  };

  const { mutate: deleteOrders } = useMutation({
    mutationKey: [DELETE_MULTIPLE_MUTATION_KEY],
    mutationFn: (ids: string[]) =>
      serverApiRequest("post", `/orders/batch-delete`, {
        data: { ids: ids },
      }),
    onSuccess: () => toast.success("Orders deleted successfully"),
    onError: () => toast.error("Orders deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  type QueryResponse = Order;

  const qc = useQueryClient();

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  const onBulkDelete = (rows: Order[], resetSelection: () => void) => {
    deleteOrders(
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

    ca("orderId", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),

    ca("customer.id", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Customer ID" />
      ),
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),

    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const items = row.original.items;
        return items[0]?.product?.imageUrls[0] ? (
          <Image
            src={items[0]?.product?.imageUrls[0] || ""}
            alt="product_img"
            width={50}
            height={50}
          />
        ) : (
          "-"
        );
      },
      enableSorting: false,
    },

    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items;
        return (
          <div className="min-w-52 flex flex-col gap-1">
            {items.map((item, index) => (
              <div key={index} className="text-sm">
                {item.quantity} × {item.name}(
                {Number(item.price ?? 0).toFixed(2)})
              </div>
            ))}
          </div>
        );
      },
      enableSorting: false,
    },

    ca("totalAmount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">
          £{Number(getValue() ?? 0).toFixed(2)}
        </span>
      ),
      enableSorting: false,
    }),

    ca("orderStatus", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Status" />
      ),
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          completed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
          shipped: "bg-blue-100 text-blue-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),

    ca("paymentStatus", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Status" />
      ),
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          paid: "bg-green-100 text-green-800",
          unpaid: "bg-yellow-100 text-yellow-800",
          refunded: "bg-blue-100 text-blue-800",
          failed: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),

    ca("royalMailStatus", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Royal Mail Status" />
      ),
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || "-"}
          </span>
        );
      },
    }),

    ca("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ getValue }) => {
        const date = getValue();
        const formatDate = (date: Date | string) =>
          format(date, "dd MMM yyyy HH:mm");
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
            edit: { path: `/orders/${row.original?.orderId}` },
            delete: { onDelete: () => deleteOrder() },
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
          key="orderSearch"
          placeholder="Search orders by ID or status"
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
