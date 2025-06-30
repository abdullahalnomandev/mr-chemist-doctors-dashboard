import { Metadata } from "next";
import EditPage from "./page-edit";

export const metadata: Metadata = {
  title: "Mr Chemist - Customer Edit",
};

export default function Page({ params }: { params: { customerId: string } }) {
  return <EditPage customerId={params.customerId} />;
}
