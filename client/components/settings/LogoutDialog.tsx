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
import { useSignout } from "@/lib/api/auth";
import { useMasterKey } from "@/lib/useMasterKey";

interface LogoutDialogProps {
  showLogoutDialog: boolean;
  setShowLogoutDialog: (show: boolean) => void;
}
const LogoutDialog = ({
  showLogoutDialog,
  setShowLogoutDialog,
}: LogoutDialogProps) => {
  const { mutate: mutateSignout } = useSignout();
  const { clearMasterKey } = useMasterKey();
  const handleLogout = () => {
    mutateSignout(undefined, {
      onSuccess: () => {
        window.location.replace("/");
        clearMasterKey();
      },
    });
  };
  return (
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end your current session. You'll need to log in again to
            access your vault.
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
  );
};

export default LogoutDialog;
