import { Metadata } from "next";
import OrderPage from "./page-order";


export const metadata: Metadata = {
  title: "Mr Chemist - Order Edit",
};

export default function Page({ params }: { params: { orderId: string } }) {
  return <OrderPage orderId={params.orderId} />;
}
