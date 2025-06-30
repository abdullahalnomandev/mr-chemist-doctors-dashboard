import { ClientProviders } from "@/components/providers/client-providers";
import { QueryProvider } from "@/components/providers/query-providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "../components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mr Chemist Admin Panel",
  description: "Admin panel for mr-chemist platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased text-rendering-optimizeLegibility`}
      >
        <QueryProvider>
          <ClientProviders>
            {children}
            <Toaster />
          </ClientProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
