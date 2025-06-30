"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Home,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Treatments",
    href: "/treatments",
    icon: Tag,
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: Tag,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Blogs",
    href: "/blogs",
    icon: FileText,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Admins",
    href: "/users",
    icon: Users,
  },
  // {
  //   title: "Discounts",
  //   href: "/discounts",
  //   icon: Percent,
  // },
  // {
  //   title: "Shipping",
  //   href: "/shipping",
  //   icon: Truck,
  // },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart3,
  // },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 py-4 text-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname?.startsWith(item.href)
              ? "bg-muted font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
