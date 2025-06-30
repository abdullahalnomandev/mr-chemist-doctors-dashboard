import TreatmentsTable from "@/components/treatments/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Treatments</h2>
        <Button asChild>
          <Link href="/treatments/create">
            <PlusCircle className="h-4 w-4" />
            Add Treatment
          </Link>
        </Button>
      </div>
      <TreatmentsTable />
    </div>
  );
}
