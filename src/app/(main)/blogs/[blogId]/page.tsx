import { Metadata } from "next";
import EditPage from "./page-edit";

export const metadata: Metadata = {
  title: "Mr Chemist - Blog Edit",
};

export default function Page({ params }: { params: { blogId: string } }) {
  return <EditPage blogId={params.blogId} />;
}