"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Palette, Eye } from "lucide-react";
import { useTheme } from "next-themes";

const SettingsPreferences = () => {
  const {theme , setTheme} = useTheme()
  return (
    <motion.div
                key="preferences"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-primary" />
                          <Label>Dark Mode</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                      <Switch checked={theme=='dark'}  onClick={()=>setTheme(theme=="dark"?'light':'dark')}/>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-primary" />
                          <Label>Auto-hide Passwords</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">Automatically mask passwords after viewing</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
  )
}

export default SettingsPreferences