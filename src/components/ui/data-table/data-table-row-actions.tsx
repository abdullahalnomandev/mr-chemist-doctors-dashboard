"use client";

import { AlertDialog, AlertDialogProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { TooltipContainer } from "../tooltip";

type DeleteActionProps = Omit<AlertDialogProps, "children">;

interface DataTableRowActionsProps {
  actions: {
    delete: DeleteActionProps;
    edit: { path?: string; onEdit?: () => void };
  };
}

export default function DataTableRowActions({
  actions,
}: DataTableRowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ActionDelete {...actions.delete} />
      <ActionEdit path={actions.edit.path} onEdit={actions.edit.onEdit} />
    </div>
  );
}

const ActionDelete = (props: DeleteActionProps) => {
  return (
    <AlertDialog {...props}>
      <TooltipContainer side="top" label="Delete">
        <Button
          variant="destructive"
          size="sm"
          className="h-7 px-3 rounded-full"
        >
          <span className="sr-only">Delete</span>
          <Trash2 className="text-red-500" />
        </Button>
      </TooltipContainer>
    </AlertDialog>
  );
};

const ActionEdit = ({
  path,
  onEdit,
}: {
  path?: string;
  onEdit?: () => void;
}) => {
  const ButtonComponents = (
    <>
      <span className="sr-only">Edit</span>
      <PencilLine className="text-muted-foreground" />
    </>
  );
  const buttonProps = path ? { asChild: true } : { onClick: onEdit };

  return (
    <TooltipContainer side="top" label="Edit">
      <Button
        {...buttonProps}
        size="sm"
        className="bg-muted-foreground/10 hover:bg-muted-foreground/30 h-7 px-3 rounded-full"
      >
        {path ? <Link href={path}>{ButtonComponents}</Link> : ButtonComponents}
      </Button>
    </TooltipContainer>
  );
};
