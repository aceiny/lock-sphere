import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState } from "react"
import Image from "next/image"
import { useEnableTFA } from "@/lib/api/user"
import { showErrorToast, showSuccessToast } from "../utils/toast-handler"

interface TfaDialogProps {
    show2FADialog: boolean
    setShow2FADialog: (show: boolean) => void
    twoFactorMethod: "authenticator" | "email"
    setTwoFactorMethod: (method: "authenticator" | "email") => void
    qrCode?: string
    otpUri?: string
}

const TfaDialog = ({
    show2FADialog,
    setShow2FADialog,
    twoFactorMethod,
    setTwoFactorMethod,
    qrCode,
    otpUri
}: TfaDialogProps) => {
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [showManualCode, setShowManualCode] = useState<boolean>(false)
  const {mutate : mutateEnableTfa} = useEnableTFA()
  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      return
    }
    setIsVerifying(true)
    mutateEnableTfa(verificationCode , {
      onSuccess: (res) => {
        console.log('res' , res)
        showSuccessToast(res.message)
        setShow2FADialog(false)
      },
      onError: (error : any) => {
        showErrorToast(error.response.data.message)
      }
    })
    setIsVerifying(false)
  }

  return (
    <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
          <DialogDescription>Choose how you want to receive authentication codes</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant={twoFactorMethod === "authenticator" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTwoFactorMethod("authenticator")}
            >
              Authenticator App
            </Button>
            <Button
              variant={twoFactorMethod === "email" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTwoFactorMethod("email")}
            >
              Email Code
            </Button>
          </div>
          {twoFactorMethod === "authenticator" ? (
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                {qrCode ? (
                  <div className="relative w-48 h-48">
                    <Image 
                      src={qrCode} 
                      alt="2FA QR Code"
                      width={192}
                      height={192}
                      className="object-contain"
                      unoptimized // Since we're dealing with a data URL
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-0 right-0"
                      onClick={() => setShowManualCode(!showManualCode)}
                    >
                      {showManualCode ? "Hide" : "Show"} Manual Code
                    </Button>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">Loading QR Code...</div>
                  </div>
                )}
              </div>
              {showManualCode && otpUri && (
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground break-all font-mono">
                    {otpUri}
                  </p>
                </div>
              )}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Install an authenticator app like Google Authenticator or Authy</p>
                <p>2. Scan the QR code with your authenticator app</p>
                <p>3. Enter the 6-digit code from the app below</p>
              </div>
              <div className="grid gap-2">
                <Label>Verification Code</Label>
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  pattern="\d{6}"
                  maxLength={6}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value="john@example.com" disabled />
              </div>
              <Button className="w-full" onClick={() => {}}>
                Send Verification Code
              </Button>
              <div className="grid gap-2">
                <Label>Verification Code</Label>
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  pattern="\d{6}"
                  maxLength={6}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShow2FADialog(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleVerification}
            disabled={verificationCode.length !== 6 || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Enable 2FA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TfaDialog