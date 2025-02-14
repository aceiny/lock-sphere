"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import ThemeToggler from "@/components/theme-toggler"
import { Shield, ArrowRight, Check, Lock, Users, Globe, Star, Zap, Gift } from "lucide-react"
import { landingData } from "@/constants/landing"
import { layoutData } from "@/constants/layout"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <Shield className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">{landingData.name}</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
          <ThemeToggler />
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dot-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="relative container px-4 md:px-6 flex flex-col items-center text-center space-y-8"
          >
            <motion.div variants={fadeIn} className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {landingData.title}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl lg:text-2xl">
                {landingData.description}
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="space-x-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-blue-500/5" />
          <div className="container px-4 md:px-6 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose LockSphere?</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Industry-leading security features to protect your digital life
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {landingData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-primary/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 ring-1 ring-primary/20 group-hover:ring-primary/30 transition-all">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Enterprise-Grade Security</h2>
                <p className="text-muted-foreground text-lg">
                  Our zero-knowledge architecture ensures that your data remains encrypted and secure at all times.
                </p>
                <ul className="space-y-3">
                  {[
                    "End-to-end encryption",
                    "Two-factor authentication",
                    "Biometric authentication",
                    "Regular security audits",
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-primary/20 to-blue-500/30 rounded-3xl blur-3xl" />
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-purple-500/10 via-primary/5 to-blue-500/10 p-8 flex items-center justify-center">
                  <Lock className="h-32 w-32 text-primary" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-background to-blue-500/5" />
          <div className="container px-4 md:px-6 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Thousands</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Join our growing community of security-conscious users
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Users, label: "Active Users", value: "50,000+" },
                { icon: Globe, label: "Countries", value: "150+" },
                { icon: Star, label: "Rating", value: "4.9/5" },
                { icon: Shield, label: "Data Protected", value: "99.99%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-primary/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center text-center space-y-2 p-6">
                    <stat.icon className="h-8 w-8 text-primary mb-2" />
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-5" />
          <div className="container px-4 md:px-6 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
              <p className="mt-4 text-muted-foreground text-lg">Join thousands of users who trust LockSphere</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Free",
                  price: "$0",
                  features: ["Basic password storage", "Secure notes", "2FA support"],
                },
                {
                  icon: Star,
                  title: "Pro",
                  price: "$4.99",
                  features: ["Everything in Free", "Advanced security", "Priority support"],
                },
                {
                  icon: Gift,
                  title: "Enterprise",
                  price: "Custom",
                  features: ["Everything in Pro", "Team management", "Custom features"],
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-purple-500/50 via-primary/50 to-blue-500/50 opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative rounded-xl border bg-card p-6 space-y-4">
                    <plan.icon className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold">{plan.title}</h3>
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Get Started
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col gap-4 md:h-24 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">{layoutData.footer.copyright}</p>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            {layoutData.footer.links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

