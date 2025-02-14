"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowRight } from "lucide-react"
import ThemeToggler from "@/components/theme-toggler"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupMFAPage() {
  return (
    <div className="min-h-screen w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to home
        </Link>
        <ThemeToggler />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container flex flex-col items-center justify-center space-y-8 px-4 md:px-6"
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Setup Two-Factor Auth</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Add an extra layer of security to your account
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Choose Authentication Method</CardTitle>
            <CardDescription>Select how you want to receive authentication codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="authenticator" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="authenticator">Authenticator App</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>
              <TabsContent value="authenticator" className="space-y-4">
                <div className="flex justify-center py-4">
                  <div className="w-48 h-48 bg-muted flex items-center justify-center">
                    {/* This would be replaced with an actual QR code */}
                    <div className="text-center text-muted-foreground">QR Code</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <Input type="text" placeholder="Enter 6-digit code" />
                </div>
                <div className="text-sm text-muted-foreground">
                  1. Install an authenticator app like Google Authenticator or Authy
                  <br />
                  2. Scan the QR code or enter the setup key manually
                  <br />
                  3. Enter the 6-digit code from the app
                </div>
              </TabsContent>
              <TabsContent value="sms" className="space-y-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex gap-2">
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                    <Button>Send Code</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <Input type="text" placeholder="Enter 6-digit code" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Enable Two-Factor Auth
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

