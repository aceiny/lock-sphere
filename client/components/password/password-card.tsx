"use client";;
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PasswordDialog } from "@/components/password/password-dialogs";
import { DeleteConfirmationDialog } from "../utils/delete-confarmation-dialog";
import { PasswordCardActions } from "./password-card-actions";

interface PasswordCardProps {
  title: string;
  username: string;
  lastUpdated: string;
  category?: string;
  logoUrl?: string;
  password: string;
  url?: string;
}

export function PasswordCard({
  title,
  username,
  lastUpdated,
  category = "Other",
  logoUrl,
  password,
  url,
}: PasswordCardProps) {
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click target is part of the dropdown menu or copy button
    const target = e.target as HTMLElement;
    if (
      target.closest('[role="menu"]') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[data-no-card-click="true"]')
    ) {
      return;
    }
    setShowViewDialog(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className="group relative overflow-hidden cursor-pointer bg-gradient-to-br from-card via-card/80 to-card hover:shadow-lg transition-all duration-300"
          onClick={handleCardClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <motion.div
                className="relative h-8 w-8 overflow-hidden rounded-full bg-muted"
                whileHover={{ scale: 1.1 }}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <span className="text-lg font-semibold text-primary">
                      {title[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </motion.div>
              <div>
                <div className="font-semibold">{title}</div>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  {category}
                </Badge>
              </div>
            </div>
            <PasswordCardActions
              onView={() => setShowViewDialog(true)}
              onEdit={() => setShowEditDialog(true)}
              onDelete={() => setShowDeleteDialog(true)}
              url={url}
            />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{username}</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Updated {lastUpdated}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity relative"
              onClick={handleCopy}
              data-no-card-click="true"
            >
              <motion.div
                animate={copied ? { scale: 0 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Copy className="h-4 w-4" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={copied ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Badge variant="secondary" className="pointer-events-none">
                  Copied!
                </Badge>
              </motion.div>
              <span className="sr-only">Copy username</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <PasswordDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        mode="view"
        data={{
          title,
          username,
          password,
          category,
          url,
        }}
      />

      <PasswordDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode="edit"
        data={{
          title,
          username,
          password,
          category,
          url,
        }}
      />
  
    <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={title}
        onConfirm={() => {
          // TODO: Implement delete functionality
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
}