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

// Updated type definition for Blog Post
type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrls: string[];
  featuredImage?: {
    url?: string;
    altText?: string;
    caption?: string;
  };
  author:
    | {
        // Assuming author is populated
        _id: string;
        name: string;
        email: string;
      }
    | string; // Could be ID or populated object
  treatment:
    | {
        // Assuming treatment is populated
        _id: string;
        name: string;
      }
    | string
    | null; // Could be ID, populated object, or null
  tags: string[];
  isPublished: boolean;
  publishedAt?: string; // Date string
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
};

// Updated query and mutation keys for Blogs
const QUERY_KEY = QK.BLOG;
const DELETE_MUTATION_KEY = QK.BLOG + "_DELETE";
const DELETE_MULTIPLE_MUTATION_KEY = QK.BLOG + "_DELETE_MULTIPLE";

// Updated sorting keys for Blogs
const sortingKeys = {
  title: "title",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isPublished: "isPublished",
  publishedAt: "publishedAt",
};

// Updated search keys for Blogs
const searchKeys = ["title", "slug", "excerpt", "tags"];

// Renamed component to BlogsTable
export default function BlogsTable() {
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
      // Updated endpoint to /blogs
      serverApiRequest("get", "/blogs", {
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

  // Updated mutation hooks for Blogs
  const { mutate: deleteBlog } = useMutation({
    mutationKey: [DELETE_MUTATION_KEY],
    mutationFn: (id: string) => serverApiRequest("delete", `/blogs/${id}`),
    onSuccess: () => toast.success("Blog post deleted successfully"),
    onError: () => toast.error("Blog post deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutate: deleteBlogs } = useMutation({
    mutationKey: [DELETE_MULTIPLE_MUTATION_KEY],
    mutationFn: (ids: string[]) =>
      serverApiRequest("post", `/blogs/batch-delete`, {
        data: { ids: ids },
      }),
    onSuccess: () => toast.success("Blog posts deleted successfully"),
    onError: () => toast.error("Blog posts deletion failed"),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  // Updated QueryResponse type
  type QueryResponse = BlogPost;

  const qc = useQueryClient();

  const { accessor: ca } = createColumnHelper<QueryResponse>();

  // Updated onBulkDelete function
  const onBulkDelete = (rows: BlogPost[], resetSelection: () => void) => {
    deleteBlogs(
      rows.map((row) => row._id),
      { onSuccess: () => resetSelection() }
    );
  };

  // Define table columns for Blog Posts
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
        return imageUrls.length > 0 ? (
          <Image
            src={imageUrls[0] || ""}
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

    ca("title", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate font-medium">
          {getValue()}
        </span>
      ),
    }),

    ca("slug", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate font-medium">
          {getValue()}
        </span>
      ),
      enableSorting: false,
    }),

    // Column for Author (assuming populated)
    ca("author", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
      cell: ({ getValue }) => {
        const author = getValue();
        // Check if author is populated or just an ID
        return (
          <span className="max-w-[150px] truncate font-medium">
            {typeof author === "object" && author !== null
              ? author.name
              : String(author)}
          </span>
        );
      },
      enableSorting: false, // Sorting by nested field might require backend support
    }),

    // Column for Treatment (assuming populated)
    ca("treatment", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Treatment" />
      ),
      cell: ({ getValue }) => {
        const treatment = getValue();
        // Check if treatment is populated or just an ID
        return (
          <span className="max-w-[150px] truncate font-medium">
            {typeof treatment === "object" && treatment !== null
              ? treatment.name
              : String(treatment || "-")}
          </span>
        );
      },
      enableSorting: false, // Sorting by nested field might require backend support
    }),

    // Column for Published Status
    ca("isPublished", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Published" />
      ),
      cell: ({ getValue }) => {
        const isPublished = getValue();
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isPublished ? "Yes" : "No"}
          </span>
        );
      },
    }),

    // createdAt column
    ca("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Create Date" />
      ),
      cell: ({ getValue }) => {
        const date = getValue();
        const formatDate = (date: Date | string) =>
          format(new Date(date), "dd MMM yyyy").toUpperCase();
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
          format(new Date(date), "dd MMM yyyy").toUpperCase();
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
            // Updated delete and edit paths
            delete: { onDelete: () => deleteBlog(row.original?._id) },
            edit: { path: `/blogs/${row.original?._id}` },
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
          key="blogSearch" // Updated key
          placeholder="Search blogs by title, slug, or tags" // Updated placeholder
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
