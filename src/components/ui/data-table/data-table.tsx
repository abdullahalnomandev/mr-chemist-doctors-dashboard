"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { EmptyResultMessage, ErrorResultMessage } from "../data-result-message";
import { ScrollArea, ScrollBar } from "../scroll-area";
import { Skeleton } from "../skeleton";
import DataTableFooter from "./data-table-footer";
import DataTableToolbar, { DataTableToolbarProps } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  isLoading: boolean;
  isError: boolean;
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  totalRows?: number;
  actions?: {
    onBulkDelete: DataTableToolbarProps<TData>["onDelete"];
  };
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export default function DataTable<TData, TValue>({
  isLoading = false,
  isError = false,
  columns,
  data,
  totalRows,
  actions,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const tableData = React.useMemo(
    () => (isLoading ? (Array(10).fill({}) as TData[]) : data || []),
    [isLoading, data]
  );
  const tableColumns = React.useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className='h-4' />,
          }))
        : columns,
    [isLoading, columns]
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    rowCount: totalRows,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const tableHeaders = table.getHeaderGroups();
  const tableRows = table.getRowModel().rows;

  const isTableEmpty = tableRows?.length === 0;

  return (
    <div className='flex h-full flex-col overflow-x-auto'>
      <div className='flex size-full grow flex-col gap-2'>
        <DataTableToolbar table={table} onDelete={actions?.onBulkDelete} />
        {/* <ScrollArea className="h-20 grow" disableScrollbar> */}
        <ScrollArea className='h-20 grow'>
          <Table
            className={cn({
              "h-full": isTableEmpty || isError,
              "pointer-events-none": isTableEmpty || isLoading || isError,
            })}>
            <TableHeader className='sticky top-0'>
              {tableHeaders.map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className='bg-secondary hover:bg-secondary'>
                  {headerGroup.headers.map(
                    ({ id, colSpan, column, isPlaceholder, getContext }) => {
                      const meta = column.columnDef.meta;
                      return (
                        <TableHead
                          key={id}
                          colSpan={colSpan}
                          data-stretch={meta?.noStretch && "compact"}
                          data-role={meta?.checkbox && "checkbox"}>
                          {isPlaceholder
                            ? null
                            : flexRender(column.columnDef.header, getContext())}
                        </TableHead>
                      );
                    }
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableBodyContent
                tableRows={tableRows}
                tableColumns={tableColumns}
                isError={isError}
              />
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
          <ScrollBar className='pb-1 pt-[calc(3rem+2px)]' />
        </ScrollArea>
      </div>
      <div className='border-t'>
        <DataTableFooter table={table} />
      </div>
    </div>
  );
}

interface TableBodyContentProps<TData, TValue> {
  tableRows: Row<TData>[];
  tableColumns: ColumnDef<TData, TValue>[];
  isError: boolean;
}

const TableBodyContent = <TData, TValue>({
  tableRows,
  tableColumns,
  isError,
}: TableBodyContentProps<TData, TValue>) => {
  const isTableEmpty = tableRows.length === 0;

  if (isError)
    return (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className='text-center'>
          <ErrorResultMessage />
        </TableCell>
      </TableRow>
    );

  if (isTableEmpty)
    return (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className='text-center'>
          <EmptyResultMessage />
        </TableCell>
      </TableRow>
    );

  return tableRows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map(({ id, column, getContext }) => {
        const meta = column.columnDef.meta;
        return (
          <TableCell
            key={id}
            data-stretch={meta?.noStretch && "compact"}
            data-role={meta?.checkbox && "checkbox"}>
            {flexRender(column.columnDef.cell, getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  ));
};

interface UseTablePaginationProps {
  pageIndex?: number;
  pageSize?: number;
  onChange?: (pagination: PaginationState) => void;
}

/**
 * A custom hook for managing table pagination state.
 *
 * This hook provides a convenient way to handle pagination in tables, including
 * state management and optional callback for pagination changes.
 *
 * @param options - Configuration options for the pagination hook.
 * @param options.pageIndex - The initial page index (0-based). Defaults to 0.
 * @param options.pageSize - The initial number of items per page. Defaults to 10.
 * @param options.onChange - Optional callback function called when pagination changes.
 * @returns An object containing the current pagination state and a function to update it.
 */
export function useTablePagination({
  pageIndex = 0,
  pageSize = 10,
  onChange,
}: UseTablePaginationProps = {}) {
  // Initialize pagination state with default or provided values
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  // Create a memoized function to handle pagination changes
  const handlePaginationChange: OnChangeFn<PaginationState> = React.useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((old: PaginationState) => PaginationState)
    ) => {
      // Determine the new pagination state
      const newValue =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      // Update internal state
      setPagination(newValue);
      // Trigger the onChange callback if provided
      onChange?.(newValue);
    },
    [pagination, onChange]
  );

  // Return the current pagination state and the function to update it
  return {
    pagination,
    onPaginationChange: handlePaginationChange,
  };
}

/**
 * Custom hook for managing table sorting state.
 *
 * @param options - The options for initializing and managing sorting.
 * @param options.sortingKeys - An object mapping column IDs to their corresponding sorting keys.
 * @param options.default - The default sorting state.
 * @param options.onChange - Optional callback function triggered when sorting changes.
 * @returns An object containing the current sorting state, formatted sorting, and a function to update sorting.
 */
export function useTableSorting({
  sortingKeys,
  onChange,
}: {
  sortingKeys: Record<string, string>;
  onChange?: OnChangeFn<SortingState>;
}) {
  // Initialize sorting state
  const [sorting, setSorting] = React.useState<SortingState>([]);

  /**
   * Formats the sorting state into an array of objects suitable for API requests.
   *
   * @param sorting - The current sorting state.
   * @returns An array of objects representing the formatted sorting.
   */
  const formatSorting = (sorting: SortingState): string[] => {
    return sorting.map((sort) => {
      const key = sortingKeys[sort.id];
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        return sort.desc ? `-${parent}.${child}` : `${parent}.${child}`;
      }
      return sort.desc ? `-${key}` : key;
    });
  };

  /**
   * Handles changes to the sorting state.
   * Updates the internal state and calls the onChange callback if provided.
   */
  const handleSortingChange: OnChangeFn<SortingState> = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newValue =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;
      setSorting(newValue);
      onChange?.(newValue);
    },
    [sorting, onChange]
  );

  // Pre-format the current sorting state
  const sortingFormatted = formatSorting(sorting);

  return {
    sortingFormatted,
    sorting,
    onSortingChange: handleSortingChange,
  };
}
