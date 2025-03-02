import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Todo App",
  description: "A modern todo application built with Next.js and NestJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
