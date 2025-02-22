"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tags } from "lucide-react";
import { PasswordCard } from "@/components/password/password-card";
import { PasswordDialog } from "@/components/password/password-dialogs";
import { CategoryDialog } from "@/components/password/category-dialog";
import { useVaults } from "@/lib/api/vault";
import { Vault } from "@/lib/types/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DashboardPage() {
  const { data, isLoading } = useVaults();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = React.useState(false);
  const vaults = data?.data?.data ? data?.data?.data : [];
  console.log(vaults);
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Passwords</h1>
          <p className="text-muted-foreground">
            Manage and organize your secure passwords
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowCategoryDialog(true)}
          >
            <Tags className="h-5 w-5" />
            <span className="sr-only">Manage categories</span>
          </Button>
          <Button
            size="lg"
            className="group"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Add Password
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search passwords..." className="pl-9" />
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {vaults.map((vault: Vault) => (
          <PasswordCard
            key={vault.id}
            website_name={vault.website_name}
            identifier={vault.identifier}
            lastUpdated={vault.updatedAt}
            category={vault?.category?.name}
            encrypted_payload={vault.encrypted_payload}
            website_url={vault.website_url}
          />
        ))}
      </motion.div>

      <PasswordDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mode="add"
      />

      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
      />
    </div>
  );
}
