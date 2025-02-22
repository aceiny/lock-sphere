import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import { ReactQueryProvider } from "@/lib/ReactQueryProvider";
import { PublicPathChecker } from "@/lib/PublicPathChecker";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "LockSphere - Password Manager",
  description: "A secure, zero-knowledge password manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <PublicPathChecker>
              <Toaster />
              {children}
            </PublicPathChecker>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
