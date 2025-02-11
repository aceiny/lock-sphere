"use client"; // Mark this as a Client Component

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/sidebar";

export function PublicPathChecker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // List of paths that should not show the sidebar
  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  return isPublicPath ? (
    <>{children}</>
  ) : (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6 md:py-12">{children}</div>
      </main>
    </div>
  );
}
