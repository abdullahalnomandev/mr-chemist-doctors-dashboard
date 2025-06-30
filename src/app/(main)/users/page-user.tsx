
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import UsersTable from "@/components/users/table";

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Admins</h2>
        <Button asChild>
          <Link href="/users/create">
            <PlusCircle className="h-4 w-4" />
            Add Admin
          </Link>
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}
