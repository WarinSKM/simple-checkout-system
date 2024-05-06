import type { Metadata } from "next";
import { K2D } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import TanstackProvider from "@/providers/TanstackProvider";
const inter = K2D({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Bebpo POS",
  description: "Bebpo pos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-background text-foreground min-h-screen flex flex-col", inter.className)}>
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
