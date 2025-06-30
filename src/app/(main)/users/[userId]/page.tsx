import { Metadata } from "next";
import EditPage from "./page-edit";

export const metadata: Metadata = {
  title: "Mr Chemist - User Edit",
};

export default function Page({ params }: { params: { userId: string } }) {
  return <EditPage userId={params.userId} />;
}
