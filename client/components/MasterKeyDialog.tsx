import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSecureStorage } from "@/lib/useSecureStorage"
import { getPasswordStrength } from "@/lib/PasswordStrangthChecker"
import { showErrorToast } from "./utils/toast-handler"

export function MasterKeyDialog() {
  const { masterKey, storeMasterKey } = useSecureStorage();
  const [showPassword, setShowPassword] = React.useState(false)
  const [masterPassword, setMasterPassword] = React.useState("")

  const handleVerify = () => {
    if(getPasswordStrength(masterPassword) != "weak"){
    storeMasterKey(masterPassword);
    setMasterPassword("")  
    return 
  }
  showErrorToast('Master Password is weak')
} 

  return (
    <Dialog open={!masterKey}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verify Master Password</DialogTitle>
          <DialogDescription>Enter your master password to view this password</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your master password"
              className="pl-10 pr-10"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide" : "Show"} password</span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={getPasswordStrength(masterPassword) == "weak"} onClick={handleVerify}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}