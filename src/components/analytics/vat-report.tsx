"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Download, FileText, Printer } from "lucide-react"

const vatData = [
  {
    id: "VAT-Q1",
    period: "Q1 2023",
    totalSales: 185000,
    vatCollected: 37000,
    status: "Submitted",
    submissionDate: "2023-04-15",
  },
  {
    id: "VAT-Q2",
    period: "Q2 2023",
    totalSales: 210000,
    vatCollected: 42000,
    status: "Submitted",
    submissionDate: "2023-07-15",
  },
  {
    id: "VAT-Q3",
    period: "Q3 2023",
    totalSales: 195000,
    vatCollected: 39000,
    status: "Submitted",
    submissionDate: "2023-10-15",
  },
  {
    id: "VAT-Q4",
    period: "Q4 2023",
    totalSales: 250000,
    vatCollected: 50000,
    status: "Pending",
    submissionDate: null,
  },
]

export function VatReport() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 0, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 11, 31))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>VAT Reports</CardTitle>
          <CardDescription>View and manage your VAT reports and submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Start Date</span>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">End Date</span>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="quarterly">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
                <span className="sr-only">Print</span>
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                  <TableHead className="text-right">VAT Collected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vatData.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.period}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      }).format(report.totalSales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      }).format(report.vatCollected)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          report.status === "Submitted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {report.submissionDate ? new Date(report.submissionDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Showing 4 VAT reports for 2023</div>
          <Button>Generate New Report</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>VAT Settings</CardTitle>
          <CardDescription>Configure VAT rates and calculation settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Default VAT Rate</h3>
              <div className="flex items-center gap-4">
                <Select defaultValue="20">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select VAT Rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Standard Rate (20%)</SelectItem>
                    <SelectItem value="5">Reduced Rate (5%)</SelectItem>
                    <SelectItem value="0">Zero Rate (0%)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">Applied to products without a specific VAT rate</span>
              </div>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">VAT Number</h3>
              <div className="flex items-center gap-4">
                <span className="font-medium">GB123456789</span>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

