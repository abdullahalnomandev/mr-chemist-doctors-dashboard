import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Truck } from "lucide-react"

export function RoyalMailIntegration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-muted p-2">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Royal Mail Integration</CardTitle>
            <CardDescription>Connect your Royal Mail account for shipping and tracking</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" placeholder="Enter your Royal Mail API key" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-secret">API Secret</Label>
            <Input id="api-secret" type="password" placeholder="Enter your Royal Mail API secret" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Features</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tracking">Shipment Tracking</Label>
                <p className="text-sm text-muted-foreground">Enable automatic tracking updates</p>
              </div>
              <Switch id="tracking" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="labels">Shipping Labels</Label>
                <p className="text-sm text-muted-foreground">Generate and print shipping labels</p>
              </div>
              <Switch id="labels" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rates">Live Rates</Label>
                <p className="text-sm text-muted-foreground">Show real-time shipping rates at checkout</p>
              </div>
              <Switch id="rates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Customer Notifications</Label>
                <p className="text-sm text-muted-foreground">Send automated shipping notifications</p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Integration Settings</Button>
      </CardFooter>
    </Card>
  )
}

