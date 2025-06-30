import { Metadata } from "next";
import EditPage from "./page-edit";

export const metadata: Metadata = {
  title: "Mr Chemist - Treatment Edit",
};

export default function Page({ params }: { params: { treatmentId: string } }) {
  return <EditPage treatmentId={params.treatmentId} />;
}
