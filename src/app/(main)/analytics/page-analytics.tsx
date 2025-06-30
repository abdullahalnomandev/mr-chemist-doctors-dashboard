import { InventoryReport } from "@/components/analytics/inventory-report";
import { ProductPerformance } from "@/components/analytics/product-performance";
import { SalesChart } from "@/components/analytics/sales-chart";
import { VatReport } from "@/components/analytics/vat-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Analytics & Reports
        </h2>
      </div>
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="vat">VAT</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <SalesChart />
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <ProductPerformance />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <InventoryReport />
        </TabsContent>
        <TabsContent value="vat" className="space-y-4">
          <VatReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
