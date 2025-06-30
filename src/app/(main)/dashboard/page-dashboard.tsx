"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import RecentOrdersTable from "@/components/dashboard/recent-orders-table";
import { serverApiRequest } from "@/lib/utils-server";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["DASHBOARD_DATA"],
    queryFn: () => serverApiRequest("get", "/admins/dashboard"),
    select: ({ data }) => ({
      data: data,
    }),
  });

  if (!data && !isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <DashboardStats data={data?.data} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <p className="text-sm text-gray-500">
            Latest orders from your customers
          </p>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
}
