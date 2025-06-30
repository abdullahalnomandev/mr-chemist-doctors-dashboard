import { RoyalMailIntegration } from "@/components/shipping/royal-mail-integration";
import { ShippingTable } from "@/components/shipping/shipping-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShippingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Shipping & Delivery
        </h2>
      </div>
      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="methods" className="space-y-4">
          <ShippingTable />
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <RoyalMailIntegration />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure global shipping settings for your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Shipping settings content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
