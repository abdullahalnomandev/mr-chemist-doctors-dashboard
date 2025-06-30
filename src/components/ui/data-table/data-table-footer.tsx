import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

interface DataTableProps<TData> {
  table: Table<TData>;
}

export default function DataTableFooter<TData>({
  table,
}: DataTableProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-5 px-6 py-5">
      <DataTableViewOptions table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}

function DataTablePagination<TData>({ table }: DataTableProps<TData>) {
  const totalRows = table.getRowCount();
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div className="flex items-center gap-2 lg:gap-5">
      <p className="text-muted-foreground">
        Showing
        {totalRows > 0 && (
          <>
            <strong className="font-medium"> {pageIndex * pageSize + 1}</strong>{" "}
            -
          </>
        )}
        <strong className="font-medium">
          {" "}
          {Math.min((pageIndex + 1) * pageSize, totalRows)}
        </strong>{" "}
        of
        <strong className="font-medium"> {totalRows}</strong> results
      </p>
      <div className="flex items-center gap-2 text-muted-foreground">
        <p className="font-medium">Results per page</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-20 px-3">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="w-20">
            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>

        {/* page list */}
        {[...Array(pageCount)].map((_, index) => {
          if (
            index === 0 ||
            index === pageCount - 1 ||
            (index >= pageIndex - 1 && index <= pageIndex + 1)
          ) {
            return (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 p-0",
                  pageIndex === index && "text-primary"
                )}
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </Button>
            );
          } else if (index === 1 || index === pageCount - 2) {
            return (
              <span
                key={index}
                className="inline-flex h-8 w-8 items-center justify-center font-medium text-muted-foreground"
              >
                ...
              </span>
            );
          }
          return null;
        })}

        <Button
          variant="ghost"
          size="icon"
          className="size-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function DataTableViewOptions<TData>({ table }: DataTableProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 space-x-2 border-border text-muted-foreground lg:w-auto"
        >
          <Settings2 />
          <span className="hidden lg:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.title || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
