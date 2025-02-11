import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PublicPathChecker } from "@/components/utils/PublicPathChecker";
import { ThemeProvider } from "@/components/utils/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lock Sphere - Password Manager",
  description: "A secure, zero-knowledge password manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicPathChecker>{children}</PublicPathChecker>
        </ThemeProvider>
      </body>
    </html>
  );
}
