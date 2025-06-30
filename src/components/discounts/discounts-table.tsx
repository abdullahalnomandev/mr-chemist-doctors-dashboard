"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, PenLine, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Discount = {
  id: string
  code: string
  type: "Percentage" | "Fixed Amount"
  value: number
  minPurchase: number | null
  maxUses: number | null
  usedCount: number
  status: "Active" | "Expired" | "Scheduled"
  startDate: string
  endDate: string
}

const data: Discount[] = [
  {
    id: "DISC-001",
    code: "SUMMER25",
    type: "Percentage",
    value: 25,
    minPurchase: 50,
    maxUses: 1000,
    usedCount: 450,
    status: "Active",
    startDate: "2023-06-01T00:00:00",
    endDate: "2023-08-31T23:59:59",
  },
  {
    id: "DISC-002",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    minPurchase: null,
    maxUses: null,
    usedCount: 1250,
    status: "Active",
    startDate: "2023-01-01T00:00:00",
    endDate: "2023-12-31T23:59:59",
  },
  {
    id: "DISC-003",
    code: "FREESHIP",
    type: "Fixed Amount",
    value: 4.99,
    minPurchase: 25,
    maxUses: 5000,
    usedCount: 3200,
    status: "Active",
    startDate: "2023-03-15T00:00:00",
    endDate: "2023-12-31T23:59:59",
  },
  {
    id: "DISC-004",
    code: "FLASH50",
    type: "Percentage",
    value: 50,
    minPurchase: 100,
    maxUses: 500,
    usedCount: 500,
    status: "Expired",
    startDate: "2023-05-01T00:00:00",
    endDate: "2023-05-03T23:59:59",
  },
  {
    id: "DISC-005",
    code: "HOLIDAY20",
    type: "Percentage",
    value: 20,
    minPurchase: 75,
    maxUses: 2000,
    usedCount: 0,
    status: "Scheduled",
    startDate: "2023-12-01T00:00:00",
    endDate: "2023-12-26T23:59:59",
  },
  {
    id: "DISC-006",
    code: "APP15",
    type: "Percentage",
    value: 15,
    minPurchase: null,
    maxUses: null,
    usedCount: 875,
    status: "Active",
    startDate: "2023-02-01T00:00:00",
    endDate: "2023-12-31T23:59:59",
  },
  {
    id: "DISC-007",
    code: "SAVE30",
    type: "Fixed Amount",
    value: 30,
    minPurchase: 150,
    maxUses: 1000,
    usedCount: 320,
    status: "Active",
    startDate: "2023-04-01T00:00:00",
    endDate: "2023-10-31T23:59:59",
  },
]

export function DiscountsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [deleteDiscountId, setDeleteDiscountId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Discount>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium uppercase">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => {
        const type = row.original.type
        const value = Number.parseFloat(row.getValue("value"))

        return (
          <div>
            {type === "Percentage"
              ? `${value}%`
              : new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(value)}
          </div>
        )
      },
    },
    {
      accessorKey: "minPurchase",
      header: "Min Purchase",
      cell: ({ row }) => {
        const minPurchase = row.getValue("minPurchase")

        if (!minPurchase) return <div>None</div>

        return (
          <div>
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
            }).format(Number.parseFloat(minPurchase as string))}
          </div>
        )
      },
    },
    {
      accessorKey: "usedCount",
      header: "Used",
      cell: ({ row }) => {
        const usedCount = Number.parseInt(row.getValue("usedCount"))
        const maxUses = row.original.maxUses

        return (
          <div>
            {usedCount}
            {maxUses ? `/${maxUses}` : ""}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Active" ? "default" : status === "Scheduled" ? "outline" : "secondary"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "endDate",
      header: "Expiry",
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const discount = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/discounts/${discount.id}/edit`)}>
                <PenLine className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteDiscountId(discount.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleDeleteDiscount = () => {
    // In a real app, you would call an API to delete the discount
    toast({
      title: "Discount deleted",
      description: `Discount ${deleteDiscountId} has been deleted.`,
    })
    setDeleteDiscountId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter discounts..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("code")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No discounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} discount(s) total.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
      <AlertDialog open={!!deleteDiscountId} onOpenChange={() => setDeleteDiscountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the discount and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDiscount} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

