"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { MoreHorizontal, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

type ShippingMethod = {
  id: string
  name: string
  carrier: string
  price: number
  estimatedDelivery: string
  active: boolean
  domestic: boolean
  international: boolean
}

const data: ShippingMethod[] = [
  {
    id: "SHIP-001",
    name: "Standard Delivery",
    carrier: "Royal Mail",
    price: 3.99,
    estimatedDelivery: "3-5 business days",
    active: true,
    domestic: true,
    international: false,
  },
  {
    id: "SHIP-002",
    name: "Express Delivery",
    carrier: "Royal Mail",
    price: 6.99,
    estimatedDelivery: "1-2 business days",
    active: true,
    domestic: true,
    international: false,
  },
  {
    id: "SHIP-003",
    name: "Next Day Delivery",
    carrier: "Royal Mail",
    price: 9.99,
    estimatedDelivery: "Next business day",
    active: true,
    domestic: true,
    international: false,
  },
  {
    id: "SHIP-004",
    name: "International Standard",
    carrier: "Royal Mail",
    price: 12.99,
    estimatedDelivery: "7-14 business days",
    active: true,
    domestic: false,
    international: true,
  },
  {
    id: "SHIP-005",
    name: "International Express",
    carrier: "Royal Mail",
    price: 19.99,
    estimatedDelivery: "3-5 business days",
    active: true,
    domestic: false,
    international: true,
  },
  {
    id: "SHIP-006",
    name: "Free Shipping",
    carrier: "Royal Mail",
    price: 0,
    estimatedDelivery: "5-7 business days",
    active: true,
    domestic: true,
    international: false,
  },
]

export function ShippingTable() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(data)
  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<ShippingMethod>[] = [
    {
      accessorKey: "name",
      header: "Method",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "carrier",
      header: "Carrier",
      cell: ({ row }) => <div>{row.getValue("carrier")}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))

        return (
          <div>
            {price === 0
              ? "Free"
              : new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(price)}
          </div>
        )
      },
    },
    {
      accessorKey: "estimatedDelivery",
      header: "Delivery Time",
      cell: ({ row }) => <div>{row.getValue("estimatedDelivery")}</div>,
    },
    {
      accessorKey: "domestic",
      header: "Domestic",
      cell: ({ row }) => (
        <Badge variant={row.original.domestic ? "default" : "outline"}>{row.original.domestic ? "Yes" : "No"}</Badge>
      ),
    },
    {
      accessorKey: "international",
      header: "International",
      cell: ({ row }) => (
        <Badge variant={row.original.international ? "default" : "outline"}>
          {row.original.international ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const method = row.original

        return (
          <Switch
            checked={method.active}
            onCheckedChange={(checked) => {
              const updatedMethods = shippingMethods.map((m) => {
                if (m.id === method.id) {
                  return { ...m, active: checked }
                }
                return m
              })
              setShippingMethods(updatedMethods)

              toast({
                title: checked ? "Shipping method activated" : "Shipping method deactivated",
                description: `${method.name} is now ${checked ? "active" : "inactive"}.`,
              })
            }}
          />
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const method = row.original
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/shipping/${method.id}/edit`)}>
                <PenLine className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: shippingMethods,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
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
                  No shipping methods found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

