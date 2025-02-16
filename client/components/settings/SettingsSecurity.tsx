"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield } from "lucide-react";
import React from "react";
import TfaDialog from "./TfaDialog";
import { useDisableTFA, useInitiateTFA, useUser } from "@/lib/api/user";
import { showErrorToast } from "../utils/toast-handler";

const SettingsSecurity = () => {
    const {data : user} = useUser()
    const {mutate : mutateInitiateTfaEnabling} = useInitiateTFA()
    const {mutate : mutateDisableTfa} = useDisableTFA()
    const [show2FADialog, setShow2FADialog] = React.useState(false)
    const [twoFactorMethod, setTwoFactorMethod] = React.useState<"authenticator" | "email">("authenticator")
    const [tfaData, setTfaData] = React.useState<{ qr_code: string, otp_uri: string } | null>(null)
    const handleInitiateTfa = async () => {
      mutateInitiateTfaEnabling(undefined , {
        onSuccess: (data) => {
          console.log('data' , data)
          setTfaData(data.data)
          setShow2FADialog(true)
        },
        onError: (error : any) => {
          showErrorToast(error.response.data.message)
        }
      })
    };
    const handleDisableTfa = async () => {
      mutateDisableTfa()
    }

  return (
    <>
     <motion.div
    key="security"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="border">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your security preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Master Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Master Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Master Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch checked={user && user.tfa_state == "enabled"} onCheckedChange={(checked) => checked ? handleInitiateTfa() : handleDisableTfa()} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <Label>Login Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Get notified about new login attempts</p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div> 
  <TfaDialog  qrCode={tfaData?.qr_code} otpUri={tfaData?.otp_uri} show2FADialog={show2FADialog} setShow2FADialog={setShow2FADialog} twoFactorMethod={twoFactorMethod} setTwoFactorMethod={setTwoFactorMethod} /> 
    </>
  )
}

export default SettingsSecurity