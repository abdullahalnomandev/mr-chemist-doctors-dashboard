import OrdersTable from "@/components/orders/table";


export default function OrdersPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Orders</h2>
      </div>
      <OrdersTable />
    </div>
  );
}
