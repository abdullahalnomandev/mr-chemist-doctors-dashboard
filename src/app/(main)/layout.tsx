import { DashboardNav } from "@/components/main/dashboard-nav";
import { MobileNav } from "@/components/main/mobile-nav";
import { UserNav } from "@/components/main/user-nav";
import { getServerSession } from "next-auth";
import type React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='sticky top-0 z-40 border-b bg-background'>
        <div className='container flex h-16 items-center justify-between p-4'>
          <div className='flex items-center gap-4 md:gap-2 lg:gap-4'>
            <MobileNav />
            <h1 className='hidden text-xl font-bold md:block'>
              Mr Chemist Admin
            </h1>
          </div>
          <UserNav user={session?.user} />
        </div>
      </header>
      <div className='container flex-1 items-start grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]'>
        <aside className='fixed top-16 z-30 hidden w-full h-full shrink-0 overflow-y-auto border-r md:sticky md:block'>
          <DashboardNav />
        </aside>
        <main className='w-full h-full overflow-hidden p-4'>{children}</main>
      </div>
    </div>
  );
}
