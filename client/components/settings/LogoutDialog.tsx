"use client";
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card";
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
import { Shield, Database, User, SettingsIcon, Activity } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"
import { useSignout } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import SettingsActivity from "@/components/settings/SettingsActivity"
import SettingsPreferences from "@/components/settings/SettingsPreferences"
import SettingsSecurity from "@/components/settings/SettingsSecurity"
import SettingsData from "@/components/settings/SettingsData"

interface LogoutDialogProps {
  showLogoutDialog : boolean,
  setShowLogoutDialog : (show : boolean) => void
  handleLogout : () => void
} 
const LogoutDialog = ({showLogoutDialog, setShowLogoutDialog, handleLogout} : LogoutDialogProps) => {
  return (
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
    )
}

export default LogoutDialog