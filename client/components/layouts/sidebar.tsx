"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden fixed top-4 left-4 z-40 hover:bg-accent/50"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <div className={cn(
                "w-full h-0.5 bg-foreground transition-all duration-300",
                open ? "rotate-45 translate-y-2" : "hover:w-3/4"
              )} />
              <div className={cn(
                "w-full h-0.5 bg-foreground transition-all duration-300",
                open && "opacity-0"
              )} />
              <div className={cn(
                "w-full h-0.5 bg-foreground transition-all duration-300",
                open ? "-rotate-45 -translate-y-2" : "w-1/2 hover:w-full"
              )} />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <MobileNav pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "300px",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className={cn(
          "hidden md:block bg-card/50 backdrop-blur-xl h-screen sticky top-0 z-30",
          "border-r border-r-muted/50 shadow-lg shadow-muted/5",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md",
            "hover:bg-accent/80 hover:scale-105 transition-all duration-300"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
          <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} sidebar</span>
        </Button>
        <div className="flex flex-col h-full">
          <motion.div 
            className={cn("flex items-center h-16 px-6", isCollapsed && "justify-center px-2")}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? (
              <Shield className="h-6 w-6 text-primary" />
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  LockSphere
                </span>
              </div>
            )}
          </motion.div>
          <ScrollArea className="flex-1 py-6">
            <div className="space-y-1 px-2">
              {routes.map((route) => (
                <Tooltip key={route.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg transition-all duration-300",
                        "hover:bg-accent/50 hover:shadow-md hover:scale-[1.02]",
                        pathname === route.href
                          ? "bg-accent/50 text-accent-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground",
                        isCollapsed ? "justify-center p-2" : "px-4 py-3",
                      )}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={route.href}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "flex items-center justify-center",
                            "transition-transform group-hover:scale-110 duration-300",
                            pathname === route.href && "text-primary",
                          )}
                        >
                          <route.icon className="h-5 w-5" />
                        </motion.div>
                      </AnimatePresence>
                      {!isCollapsed && (
                        <span className="font-medium transition-colors duration-300">{route.label}</span>
                      )}
                      {!isCollapsed && pathname === route.href && (
                        <motion.div
                          layoutId="activeRoute"
                          className="ml-auto h-2 w-2 rounded-full bg-primary"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="font-medium">
                      {route.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </div>
      </motion.nav>
    </TooltipProvider>
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
        <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          LockSphere
        </span>
      </div>
      <div className="px-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300",
                "hover:bg-accent/50 hover:shadow-md hover:scale-[1.02]",
                pathname === route.href
                  ? "bg-accent/50 text-accent-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={route.href}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-center justify-center",
                    "transition-transform group-hover:scale-110 duration-300",
                    pathname === route.href && "text-primary",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                </motion.div>
              </AnimatePresence>
              <span className="font-medium transition-colors duration-300">{route.label}</span>
              {pathname === route.href && (
                <motion.div
                  layoutId="activeRouteMobile"
                  className="ml-auto h-2 w-2 rounded-full bg-primary"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}