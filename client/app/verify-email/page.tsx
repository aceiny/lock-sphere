"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight } from "lucide-react"
import ThemeToggler from "@/components/theme-toggler"

export default function VerifyEmailPage() {
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
          <Mail className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Check Your Email</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            We've sent a verification code to your email address
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>Enter the 6-digit code we sent to your email</CardDescription>
          </CardHeader>
          <form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-2xl"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Verify Email
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Didn't receive the code? </span>
                <Button variant="link" className="p-0 h-auto">
                  Resend
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

