import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function LowStockAlert() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle className="text-lg">Low Stock Alert</CardTitle>
          <CardDescription>Products that need to be restocked soon</CardDescription>
        </div>
        <AlertTriangle className="ml-auto h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="grid gap-1">
                <p className="font-medium">{item.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>SKU: {item.sku}</span>
                  <span>•</span>
                  <span>Category: {item.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-amber-50">
                  {item.stock} left
                </Badge>
                <Button size="sm" variant="outline">
                  Restock
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const lowStockItems = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    sku: "TS-001",
    category: "Men",
    stock: 5,
  },
  {
    id: "2",
    name: "Wireless Earbuds",
    sku: "EL-003",
    category: "Electronics",
    stock: 3,
  },
  {
    id: "3",
    name: "Leather Handbag",
    sku: "BG-007",
    category: "Women",
    stock: 2,
  },
  {
    id: "4",
    name: "Smart Watch",
    sku: "EL-012",
    category: "Electronics",
    stock: 4,
  },
]

