"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Copy,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { PasswordDialog } from "@/components/password/password-dialogs";

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
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-card-click="true"]')) {
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
            <div data-no-card-click="true">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {url && (
                    <DropdownMenuItem
                      onClick={() => window.open(url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Site
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{username}</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Updated {lastUpdated}
            </div>
            <div data-no-card-click="true">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity relative"
                onClick={handleCopy}
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
            </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the password for {title}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // TODO: Implement delete functionality
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
