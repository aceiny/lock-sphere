"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AuthForm } from "@/components/auth/auth-form"
import ThemeToggler from "@/components/theme-toggler"

export default function RegisterPage() {
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
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Create Account</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Join SecureVault and take control of your passwords
          </p>
        </div>
        <AuthForm mode="register" />
      </motion.div>
    </div>
  )
}

