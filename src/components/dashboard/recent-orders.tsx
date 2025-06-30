import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Define the OrderStatus enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Define the types for the order data
type Customer = {
  _id: string; // Assuming customer object is populated
  name: string;
  email: string;
  // Add initials if available, or generate them
  initials?: string;
}

type OrderItem = {
  _id: string;
  product: string | { _id: string; name: string } | null; // Could be ID or populated object
  name: string;
  variant: string;
  productBasePrice: number;
  quantity: number;
  type: string;
  unit: string;
  price: number;
  value: string;
};

type Order = {
  _id: string;
  orderId: string;
  royalMailStatus: string;
  customer: string | Customer; // Could be ID or populated object
  items: OrderItem[];
  couponCode: string;
  orderStatus: OrderStatus; // Use the enum type
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  __v: number;
  orderIdentifier: number;
};

interface RecentOrdersProps {
  orders: Order[]; // Use the defined Order type
}

// Update the component signature to accept typed orders prop
export function RecentOrders({ orders }: RecentOrdersProps) {

  if(!orders) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Loading ....</span>
      </div>
    ) 
  }

  if(orders.length === 0) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">No recent orders</span>
      </div>
    ) 
  }

  return (
    // Add max-h and overflow-y-auto for scrollability
    <div className="space-y-8 max-h-[300px] overflow-y-auto pr-4">
      {/* Map over the orders prop */}
      {orders.map((order) => {
        // Assuming customer is populated, otherwise you'd need to handle it
        const customer = order?.customer as Customer;
        // const customerInitials = customer.initials || customer.name.split(' ').map(n => n[0]).join('');

        return (
          <div key={order._id} className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* <AvatarFallback>{customerInitials}</AvatarFallback> */}
            </Avatar>
            <div className="ml-4 space-y-1">
              {/* <p className="text-sm font-medium leading-none">{customer.name}</p> */}
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div className="ml-auto font-medium">
              {/* Use order.orderStatus and the updated getOrderStatusVariant */}
              <Badge variant={getOrderStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
            </div>
            {/* Use order.totalAmount */}
            <div className="ml-4 font-medium">£{Number(order.totalAmount ?? 0).toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  )
}

// Update the function to use the OrderStatus enum and lowercase strings
function getOrderStatusVariant(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING:
      return "outline"
    case OrderStatus.PROCESSING:
      return "secondary"
    case OrderStatus.SHIPPED:
      return "default"
    case OrderStatus.DELIVERED:
      return "success"
    case OrderStatus.CANCELLED:
      return "destructive"
    default:
      return "outline"
  }
}

// Remove the hardcoded recentOrders array
// const recentOrders = [...]

