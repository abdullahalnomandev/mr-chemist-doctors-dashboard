import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, EyeOff } from "lucide-react";
import { Fragment } from "react";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("uppercase", className)}>{title}</div>;
  }

  const sortIcon = {
    desc: <ArrowDown className="size-4" />,
    asc: <ArrowUp className="size-4" />,
    default: <ArrowDownUp className="size-4" />,
  };

  const sortMenuItems = [
    [
      {
        label: "Asc",
        icon: ArrowUp,
        onClick: () => (column.getIsSorted() === "asc" ? column.clearSorting() : column.toggleSorting(false)),
        checked: column.getIsSorted() === "asc",
      },
      {
        label: "Desc",
        icon: ArrowDown,
        onClick: () => (column.getIsSorted() === "desc" ? column.clearSorting() : column.toggleSorting(true)),
        checked: column.getIsSorted() === "desc",
      },
    ],
    [{ label: "Hide", icon: EyeOff, onClick: () => column.toggleVisibility(false), checked: !column.getIsVisible() }],
  ];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-2 h-8 hover:bg-transparent data-[state=open]:text-primary">
            <span className="uppercase">{title}</span>
            {sortIcon[column.getIsSorted() as keyof typeof sortIcon] || sortIcon.default}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortMenuItems.map((group, index) => (
            <Fragment key={index}>
              {group.map(({ label, icon: Icon, onClick, checked }) => (
                <Fragment key={label}>
                  <DropdownMenuCheckboxItem onClick={onClick} className="gap-2" checked={checked}>
                    <Icon className="size-3.5" />
                    {label}
                  </DropdownMenuCheckboxItem>
                </Fragment>
              ))}
              {index < sortMenuItems.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
