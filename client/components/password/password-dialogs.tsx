"use client";

import * as React from "react";
import { Eye, EyeOff, Copy, KeyRound, Globe, Tag, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit" | "view";
  data?: {
    title: string;
    username: string;
    password: string;
    category: string;
    url?: string;
  };
}

export function PasswordDialog({
  open,
  onOpenChange,
  mode,
  data,
}: PasswordDialogProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [requestingPassword, setRequestingPassword] = React.useState(false);
  const [masterPassword, setMasterPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password management logic
    onOpenChange(false);
  };

  const handleVerifyMasterPassword = () => {
    // TODO: Implement master password verification
    setShowPassword(true);
    setRequestingPassword(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add Password"
              : mode === "edit"
                ? "Edit Password"
                : "View Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new password to your vault"
              : mode === "edit"
                ? "Edit your stored password"
                : "View your stored password details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">App/Website Name</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="e.g. Gmail, Twitter"
                  className="pl-10"
                  defaultValue={data?.title}
                  readOnly={mode === "view"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  className="pl-10"
                  defaultValue={data?.url}
                  readOnly={mode === "view"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username/Email</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  className="pl-10"
                  defaultValue={data?.username}
                  readOnly={mode === "view"}
                />
                {mode === "view" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.username || "");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy username</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                {mode === "view" && !showPassword ? (
                  <div className="flex items-center gap-2">
                    <Input value="••••••••••••" className="pl-10" readOnly />
                    <Button
                      type="button"
                      onClick={() => setRequestingPassword(true)}
                    >
                      Show Password
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-20"
                      defaultValue={data?.password}
                      readOnly={mode === "view"}
                    />
                    <div className="absolute right-0 top-0 flex h-full items-center gap-1 px-3">
                      {mode === "view" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="hover:bg-transparent"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.password || "");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy password</span>
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide" : "Show"} password
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                {mode === "view" ? (
                  <div className="flex h-10 items-center pl-10">
                    <Badge variant="secondary">{data?.category}</Badge>
                  </div>
                ) : (
                  <Select defaultValue={data?.category}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {mode !== "view" && (
              <Button type="submit">
                {mode === "add" ? "Add Password" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>

      <Dialog open={requestingPassword} onOpenChange={setRequestingPassword}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify Master Password</DialogTitle>
            <DialogDescription>
              Enter your master password to view this password
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your master password"
                className="pl-10 pr-10"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide" : "Show"} password
                </span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRequestingPassword(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleVerifyMasterPassword}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
