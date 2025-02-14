"use client"; // Mark this as a Client Component

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";

export function PublicPathChecker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // List of paths that should not show the sidebar
  const publicPaths = ["/", "/login", "/register", "/verify-email", "/verify-mfa"]
  const isPublicPath = publicPaths.includes(pathname);

  return (
    <>
    {isPublicPath ? (
              children
            ) : (
              <div className="flex h-screen">
                <Sidebar className="w-64 flex-shrink-0" />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto">
                    <div className="container py-6 md:py-8 lg:py-10">{children}</div>
                  </main>
                </div>
              </div>
            )}
    </>
  )
}
