"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tags } from "lucide-react";
import { PasswordCard } from "@/components/password/password-card";
import { PasswordDialog } from "@/components/password/password-dialogs";
import { CategoryDialog } from "@/components/password/category-dialog";

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
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = React.useState(false);

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
        <PasswordCard
          title="Gmail"
          username="john.doe@gmail.com"
          lastUpdated="2024-02-11"
          category="Email"
          logoUrl="https://www.google.com/gmail/about/static/images/logo-gmail.png?cache=1adba63"
          password="mysecretpassword123"
          url="https://gmail.com"
        />
        <PasswordCard
          title="GitHub"
          username="johndoe"
          lastUpdated="2024-02-10"
          category="Development"
          logoUrl="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          password="githubpass456"
          url="https://github.com"
        />
        <PasswordCard
          title="Dropbox"
          username="john.doe@gmail.com"
          lastUpdated="2024-02-09"
          category="Storage"
          logoUrl="https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox-ios@2x.png"
          password="dropbox789"
          url="https://dropbox.com"
        />
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
