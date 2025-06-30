import ConsultationsTable from "@/components/consultations/table";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";
// import Link from "next/link";

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Consultations</h2>
        {/* <Link href="/consultations/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Consultation
          </Button>
        </Link> */}
      </div>
      <ConsultationsTable />
    </div>
  );
}
