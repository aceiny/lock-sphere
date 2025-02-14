"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react";
import React from "react";

const SettingsProfile = () => {
      const [formChanges, setFormChanges] = React.useState({
        name: false,
        email: false,
      })
        const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
        const [avatarPreview, setAvatarPreview] = React.useState("/placeholder.svg")
        const fileInputRef = React.useRef<HTMLInputElement>(null)
          const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
              setAvatarFile(file)
              const reader = new FileReader()
              reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
              }
              reader.readAsDataURL(file)
            }
          }
        
          const handleInputChange = (field: "name" | "email", value: string) => {
            const defaultValues = {
              name: "John Doe",
              email: "john@example.com",
            }
            setFormChanges((prev) => ({
              ...prev,
              [field]: value !== defaultValues[field],
            }))
          }
  return (
           <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and avatar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-muted">
                          <img
                            src={avatarPreview || "/placeholder.svg"}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">Upload a new avatar</p>
                        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                          Upload New
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          defaultValue="John Doe"
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="john@example.com"
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <Button disabled={!formChanges.name && !formChanges.email}>
                        {formChanges.name || formChanges.email ? "Save Changes" : "No Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
  )
}

export default SettingsProfile