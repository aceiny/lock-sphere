"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, LogOut, ChevronLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { routes } from "@/constant/sidebar.data";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();


  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <MobileNav routes={routes} pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <motion.nav
        initial={false}
        animate={{ width: isCollapsed ? "80px" : "280px" }}
        className={cn(
          "sticky hidden md:block border-r bg-card min-h-screen  top-0 z-30",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <span className="sr-only">
            {isCollapsed ? "Expand" : "Collapse"} sidebar
          </span>
        </Button>
        <DesktopNav
          routes={routes}
          pathname={pathname}
          isCollapsed={isCollapsed}
        />
      </motion.nav>
    </>
  );
}

function MobileNav({
  routes,
  pathname,
  setOpen,
}: {
  routes: Array<{ label: string; icon: any; href: string }>;
  pathname: string;
  setOpen: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">
                john@example.com
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              // TODO: Implement logout
              setOpen(false);
            }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

function DesktopNav({
  routes,
  pathname,
  isCollapsed,
}: {
  routes: Array<{ label: string; icon: any; href: string }>;
  pathname: string;
  isCollapsed: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-full p-4">
      <div
        className={cn(
          "flex items-center gap-2 mb-6",
          isCollapsed ? "justify-center" : "justify-between px-2",
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">
                john@example.com
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-4">
        <div className="space-y-2 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed && "justify-center px-2",
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  "group-hover:scale-110",
                )}
              />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className={cn("pt-4", isCollapsed && "items-center")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2",
            isCollapsed && "justify-center px-2",
          )}
          onClick={() => {
            // TODO: Implement logout
          }}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
