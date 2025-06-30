"use client";

import { QK } from "@/lib/query-keys";
import { serverApiRequest } from "@/lib/utils-server";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function OrderPage({ orderId }: { orderId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QK.ORDER, { id: orderId }],
    queryFn: () => serverApiRequest("get", `/orders/${orderId}`),
    enabled: !!orderId,
    select: (data) => data.data,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        Error loading order. Please try again later.
      </div>
    );
  }

  const {
    orderStatus,
    customer,
    paymentStatus,
    totalAmount,
    subTotal,
    taxAmount,
    createdAt,
    items,
  } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex">
          <h1 className="mb-4 text-2xl font-semibold">Order #{orderId}</h1>
          <h1 className="mb-4 text-2xl font-semibold">
            Customer #{customer.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="text-muted-foreground block text-sm">
              Order Status
            </span>
            <span className="font-medium capitalize">{orderStatus}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-sm">
              Payment Status
            </span>
            <span className="font-medium capitalize">{paymentStatus}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-sm">
              Placed At
            </span>
            <span className="font-medium">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="mb-2 text-lg font-medium">Items</h2>
        <div className="space-y-4">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-gray-50">
                <Image
                  src={item.product.imageUrls?.[0] || "/placeholder-image.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">
                  Quantity: {item.quantity} | Weight: {item.value}
                  {item.unit}
                </div>
                <div className="text-muted-foreground text-sm">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="flex w-full max-w-sm justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex w-full max-w-sm justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="text-primary flex w-full max-w-sm justify-between font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
