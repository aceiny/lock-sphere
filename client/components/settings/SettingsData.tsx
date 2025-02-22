"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, LogOut, Database } from "lucide-react";
import React from "react";
import { useSignout } from "@/lib/api/auth";
import ExportDataDialog from "./ExportDataDialog";
import LogoutDialog from "./LogoutDialog";

const SettingsData = () => {
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const exportVault = {
    mutateAsync: async () => {
      console.log("Export vault - to be implemented");
    },
  };
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const handleExport = async () => {
    try {
      await exportVault.mutateAsync();
      setShowExportDialog(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };
  return (
    <>
      <motion.div
        key="data"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export your data or manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <Label>Export Vault Data</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download a backup of your vault
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <Label className="text-red-500">Logout</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  End your current session
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <ExportDataDialog
        showExportDialog={showExportDialog}
        setShowExportDialog={setShowExportDialog}
        handleExport={handleExport}
      />
      <LogoutDialog
        showLogoutDialog={showLogoutDialog}
        setShowLogoutDialog={setShowLogoutDialog}
      />
    </>
  );
};

export default SettingsData;
