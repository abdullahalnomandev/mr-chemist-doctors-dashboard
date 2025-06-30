"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw } from "lucide-react"

const inventoryData = [
  {
    id: "PROD-1",
    name: "Premium Cotton T-Shirt",
    sku: "TS-001",
    category: "Men",
    stock: 150,
    stockLevel: 75, // percentage
    status: "In Stock",
    lastUpdated: "2023-11-10",
  },
  {
    id: "PROD-2",
    name: "Wireless Earbuds",
    sku: "EL-003",
    category: "Electronics",
    stock: 75,
    stockLevel: 50,
    status: "In Stock",
    lastUpdated: "2023-11-08",
  },
  {
    id: "PROD-3",
    name: "Leather Handbag",
    sku: "BG-007",
    category: "Women",
    stock: 45,
    stockLevel: 30,
    status: "In Stock",
    lastUpdated: "2023-11-05",
  },
  {
    id: "PROD-4",
    name: "Smart Watch",
    sku: "EL-012",
    category: "Electronics",
    stock: 60,
    stockLevel: 40,
    status: "In Stock",
    lastUpdated: "2023-11-12",
  },
  {
    id: "PROD-5",
    name: "Denim Jeans",
    sku: "CL-023",
    category: "Men",
    stock: 120,
    stockLevel: 80,
    status: "In Stock",
    lastUpdated: "2023-11-07",
  },
  {
    id: "PROD-6",
    name: "Yoga Mat",
    sku: "SP-008",
    category: "Sports",
    stock: 5,
    stockLevel: 5,
    status: "Low Stock",
    lastUpdated: "2023-11-09",
  },
  {
    id: "PROD-7",
    name: "Coffee Maker",
    sku: "HM-015",
    category: "Home",
    stock: 0,
    stockLevel: 0,
    status: "Out of Stock",
    lastUpdated: "2023-11-11",
  },
]

export function InventoryReport() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current stock levels and inventory status</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.stockLevel} className="h-2" />
                      <span className="text-sm text-muted-foreground">{item.stockLevel}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "outline" : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

