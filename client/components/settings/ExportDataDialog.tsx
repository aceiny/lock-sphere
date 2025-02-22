"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExportDataDialogProps {
  showExportDialog: boolean;
  setShowExportDialog: (show: boolean) => void;
  handleExport: () => void;
}

const ExportDataDialog = ({
  showExportDialog,
  setShowExportDialog,
  handleExport,
}: ExportDataDialogProps) => {
  return (
    <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export Vault Data</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to export all your vault data in an encrypted format.
            This file will contain all your passwords and secure notes. Keep
            this file safe and never share it with anyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleExport}>
            Continue Export
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExportDataDialog;
