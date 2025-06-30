import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { AlertDialog } from "../alert-dialog";
import { Button } from "../button";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
  description?: string;
  onDelete?: (rows: TData[], resetSelection: () => void) => void;
}
export default function DataTableToolbar<TData>({
  table,
  title,
  description,
  onDelete,
}: DataTableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  if (selectedRows.length > 0) {
    description =
      description ||
      "Are you sure you want to delete all these items? This action cannot be undone.";
    return (
      <div className='flex items-center justify-between bg-secondary px-4 py-2'>
        <p className='font-medium'>{selectedRows.length} selected</p>
        <AlertDialog
          title={title}
          description={description}
          onDelete={() =>
            onDelete?.(
              selectedRows.map((row) => row.original),
              table.resetRowSelection
            )
          }>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 gap-2 text-secondary-foreground hover:bg-red-100 hover:text-red-500'>
            <Trash2 />
            Delete All
          </Button>
        </AlertDialog>
      </div>
    );
  }
  return null;
}
