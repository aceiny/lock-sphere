"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ThemeToggler from "@/components/theme-toggler"
import { layoutData } from "@/constants/layout"
import { Settings, LogOut, User, Bell } from 'lucide-react'
import { motion } from "framer-motion"

export function Navbar() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  const handleSettingsNavigation = (section: string) => {
    router.push(`/settings?section=${section}`)
  }

  const handleLogout = () => {
    setShowLogoutDialog(false)
  }

  return (
    <div className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-4 px-4 sm:gap-8">
        <div className="ml-auto flex items-center gap-4 md:gap-6">
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-4 pr-4 pl-2 py-1.5 bg-card hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all">
                  <span className="text-sm font-medium group-hover:scale-110 transition-transform">
                    {layoutData.user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {layoutData.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{layoutData.user.email}</span>
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end">
              <div className="flex items-center gap-4 p-2 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-medium">{layoutData.user.name.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{layoutData.user.name}</span>
                  <span className="text-sm text-muted-foreground">{layoutData.user.email}</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <DropdownMenuItem onClick={() => router.push("/settings?section=profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings?section=security")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Security Settings</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current session. You'll need to log in again to access your vault.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

