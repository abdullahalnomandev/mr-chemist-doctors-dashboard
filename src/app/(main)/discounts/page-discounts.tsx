import { DiscountsTable } from "@/components/discounts/discounts-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DiscountsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Discounts & Coupons
        </h2>
        <Button asChild>
          <Link href="/discounts/create">
            <PlusCircle className="h-4 w-4" />
            Add Discount
          </Link>
        </Button>
      </div>
      <DiscountsTable />
    </div>
  );
}
