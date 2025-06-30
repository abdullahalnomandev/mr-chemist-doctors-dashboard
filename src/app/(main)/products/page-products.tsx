import ProductsTable from "@/components/products/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/products/create">
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}
