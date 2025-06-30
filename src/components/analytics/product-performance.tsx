"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

const topProducts = [
  {
    id: "PROD-1",
    name: "Premium Cotton T-Shirt",
    category: "Men",
    sales: 1250,
    revenue: 37487.5,
    trend: "up",
    growth: 15,
  },
  {
    id: "PROD-4",
    name: "Smart Watch",
    category: "Electronics",
    sales: 980,
    revenue: 195980.2,
    trend: "up",
    growth: 22,
  },
  {
    id: "PROD-2",
    name: "Wireless Earbuds",
    category: "Electronics",
    sales: 875,
    revenue: 78741.25,
    trend: "up",
    growth: 8,
  },
  {
    id: "PROD-5",
    name: "Denim Jeans",
    category: "Men",
    sales: 750,
    revenue: 44992.5,
    trend: "down",
    growth: 3,
  },
  {
    id: "PROD-3",
    name: "Leather Handbag",
    category: "Women",
    sales: 620,
    revenue: 80597.8,
    trend: "neutral",
    growth: 0,
  },
]

const categoryData = [
  { name: "Electronics", sales: 2450 },
  { name: "Men", sales: 2100 },
  { name: "Women", sales: 1850 },
  { name: "Home", sales: 1200 },
  { name: "Accessories", sales: 950 },
  { name: "Sports", sales: 750 },
]

export function ProductPerformance() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Your best performing products by sales and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.sales}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(product.revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Badge
                        variant={
                          product.trend === "up" ? "default" : product.trend === "down" ? "destructive" : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {product.trend === "up" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : product.trend === "down" ? (
                          <ArrowDown className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {product.growth}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
          <CardDescription>Product sales distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="sales" fill="currentColor" radius={[0, 4, 4, 0]} className="fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

