import { Metadata } from "next";
import EditPage from "./page-edit";

export const metadata: Metadata = {
  title: "Mr Chemist - Product Edit",
};

export default function Page({ params }: { params: { productId: string } }) {
  return <EditPage productId={params.productId} />;
}