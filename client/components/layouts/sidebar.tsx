"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <span className="sr-only">Toggle navigation menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <div className={cn("w-full h-0.5 bg-foreground transition-all", open && "rotate-45 translate-y-2")} />
              <div className={cn("w-full h-0.5 bg-foreground transition-all", open && "opacity-0")} />
              <div className={cn("w-full h-0.5 bg-foreground transition-all", open && "-rotate-45 -translate-y-2")} />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <MobileNav pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
          transition: { duration: 0.2 },
        }}
        className={cn(
          "relative hidden md:block bg-card/50 backdrop-blur-sm h-screen sticky top-0 z-30",
          "border-r border-r-muted/50",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} sidebar</span>
        </Button>
        <div className="flex flex-col h-full">
          <div className={cn("flex items-center h-16 px-6", isCollapsed && "justify-center px-2")}>
            {isCollapsed ? (
              <Shield className="h-6 w-6 text-primary" />
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">LockSphere</span>
              </div>
            )}
          </div>
          <ScrollArea className="flex-1 py-6">
            <div className="space-y-2 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg transition-all",
                    "hover:bg-accent/50 hover:shadow-sm",
                    pathname === route.href
                      ? "bg-accent/50 text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                    isCollapsed ? "justify-center p-2" : "px-4 py-2",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      "transition-transform group-hover:scale-105",
                      pathname === route.href && "text-primary",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                  </div>
                  {!isCollapsed && <span className="font-medium">{route.label}</span>}
                  {!isCollapsed && pathname === route.href && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </motion.nav>
    </>
  )
}

function MobileNav({
  pathname,
  setOpen,
}: {
  pathname: string
  setOpen: (open: boolean) => void
}) {
  return (
    <ScrollArea className="h-full py-6">
      <div className="flex items-center gap-2 px-6 mb-8">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">LockSphere</span>
      </div>
      <div className="px-2">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-2 transition-all",
                "hover:bg-accent/50 hover:shadow-sm",
                pathname === route.href
                  ? "bg-accent/50 text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  "transition-transform group-hover:scale-105",
                  pathname === route.href && "text-primary",
                )}
              >
                <route.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{route.label}</span>
              {pathname === route.href && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

