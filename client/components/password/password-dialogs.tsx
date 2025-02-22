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
import { useCreateVault } from "@/lib/api/vault";
import { useMasterKey } from "@/lib/useMasterKey";
import { showErrorToast, showSuccessToast } from "../utils/toast-handler";
import { decryptPassword, encryptPassword } from "../utils/encryption";
import { useCategories } from "@/lib/api/categories";
import { motion } from "framer-motion";

interface PasswordData {
  identifier: string;
  encrypted_payload: string;
  website_name: string;
  website_url?: string;
  category: string | undefined;
}

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "view";
  data?: PasswordData;
}

const defaultFormData: PasswordData = {
  identifier: "",
  encrypted_payload: "",
  website_name: "",
  website_url: "",
  category: undefined,
};

export function PasswordDialog({
  open,
  onOpenChange,
  mode,
  data,
}: PasswordDialogProps) {
  const { data: categories, isLoading } = useCategories();
  const [showPassword, setShowPassword] = React.useState(false);
  const { masterKey, isVerified } = useMasterKey();
  const [formData, setFormData] = React.useState<PasswordData>(defaultFormData);
  const [decryptedPassword, setDecryptedPassword] = React.useState("");
  const { mutate: createVault } = useCreateVault();
  const [copied, setCopied] = React.useState<{
    type: "identifier" | "password" | null;
  }>({ type: null });

  // Reset form data when dialog opens/closes or mode changes
  React.useEffect(() => {
    if (mode === "add") {
      setFormData(defaultFormData);
      setDecryptedPassword("");
    } else if (data) {
      setFormData(data);
      setDecryptedPassword("");
    }
    setShowPassword(false);
  }, [mode, data, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "encrypted_payload") {
      setDecryptedPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleShowPassword = () => {
    if (!masterKey || !isVerified) {
      showErrorToast("Master key is not set or verified!");
      return;
    }

    try {
      const decrypted = decryptPassword(formData.encrypted_payload, masterKey);
      setDecryptedPassword(decrypted);
      setShowPassword(true);
    } catch (error) {
      showErrorToast("Failed to decrypt password!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!masterKey || !isVerified) {
      showErrorToast("Master key is not set or verified!");
      return;
    }

    if (mode === "add") {
      try {
        const encryptedData = {
          ...formData,
          encrypted_payload: encryptPassword(decryptedPassword, masterKey),
        };

        // Remove category if it's undefined
        const payloadToSend = encryptedData.category
          ? encryptedData
          : (({ category, ...rest }) => rest)(encryptedData);

        createVault(payloadToSend, {
          onSuccess: () => {
            showSuccessToast("Password added successfully!");
            onOpenChange(false);
          },
          onError: () => {
            showErrorToast("Failed to add password! Try again");
          },
        });
      } catch (error) {
        showErrorToast("Failed to encrypt password!");
      }
    }
  };

  const copyToClipboard = (text: string, type: "identifier" | "password") => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied({ type });
        setTimeout(() => setCopied({ type: null }), 2000);
      })
      .catch(() => showErrorToast("Failed to copy to clipboard!"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Password" : "View Password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new password to your vault"
              : "View your stored password details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="website_name">App/Website Name</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="website_name"
                  placeholder="e.g. Gmail, Twitter"
                  className="pl-10"
                  value={formData.website_name}
                  onChange={handleInputChange}
                  readOnly={mode === "view"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website_url">URL (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
                  className="pl-10"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  readOnly={mode === "view"}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="identifier">Username/Email</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="identifier"
                  className="pl-10"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  readOnly={mode === "view"}
                />
                {mode === "view" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      copyToClipboard(formData.identifier, "identifier")
                    }
                  >
                    <motion.div
                      animate={
                        copied.type === "identifier"
                          ? { scale: 0 }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={
                        copied.type === "identifier"
                          ? { scale: 1 }
                          : { scale: 0 }
                      }
                      transition={{ duration: 0.2 }}
                      className="absolute"
                    >
                      <Badge
                        variant="secondary"
                        className="pointer-events-none"
                      >
                        Copied!
                      </Badge>
                    </motion.div>
                    <span className="sr-only">Copy identifier</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="encrypted_payload">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                {mode === "view" && !showPassword ? (
                  <div className="flex items-center gap-2">
                    <Input value="••••••••••••" className="pl-10" readOnly />
                    <Button type="button" onClick={handleShowPassword}>
                      Show Password
                    </Button>
                  </div>
                ) : (
                  <div className="">
                    <Input
                      id="encrypted_payload"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-20"
                      value={
                        mode === "view" ? decryptedPassword : decryptedPassword
                      }
                      onChange={handleInputChange}
                      readOnly={mode === "view"}
                    />
                    <div className="absolute right-0 top-0 flex h-full items-center gap-1 px-3">
                      {mode === "view" && showPassword && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="hover:bg-transparent"
                          onClick={() =>
                            copyToClipboard(decryptedPassword, "password")
                          }
                        >
                          <motion.div
                            animate={
                              copied.type === "password"
                                ? { scale: 0 }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <Copy className="h-4 w-4" />
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={
                              copied.type === "password"
                                ? { scale: 1 }
                                : { scale: 0 }
                            }
                            transition={{ duration: 0.2 }}
                            className="absolute"
                          >
                            <Badge
                              variant="secondary"
                              className="pointer-events-none"
                            >
                              Copied!
                            </Badge>
                          </motion.div>
                          <span className="sr-only">Copy password</span>
                        </Button>
                      )}
                      {(mode === "add" || showPassword) && (
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
                      )}
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
                    <Badge variant="secondary">{formData.category}</Badge>
                  </div>
                ) : (
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <div className="w-full flex items-center justify-center text-muted-foreground">
                          Loading categories...
                        </div>
                      ) : categories?.length === 0 ? (
                        <div className="w-full flex items-center justify-center text-muted-foreground">
                          No categories yet
                        </div>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {mode !== "view" && <Button type="submit">Add Password</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
