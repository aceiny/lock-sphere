"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useUser, useUpdateProfilePicture } from "@/lib/api/user";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import type { AxiosProgressEvent } from "axios";
import LoadingScreen from "../utils/LoadingScreen";

const SettingsProfile: React.FC = () => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: mutateProfilePicture } = useUpdateProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formDataToUpload = new FormData();
    formDataToUpload.append("avatar", file);

    try {
      mutateProfilePicture({
        formData: formDataToUpload,
        options: {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
            }
          },
        },
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (field: "name" | "email", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // await updateUser(formData);
      // mutate(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || !user) return <LoadingScreen />;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
      <Card className="border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-muted">
                <Image
                  src={user.profile_picture || "/default_picture.jpg"}
                  alt="Avatar"
                  className="object-cover"
                  height={100}
                  width={100}
                  priority
                  quality={90}
                />
              </div>
              <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="h-4 w-4" />
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">Upload a new avatar</p>
              <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload New"}
              </Button>
              {isUploading && (
                <div className="mt-2 space-y-2">
                  <Progress value={uploadProgress} className="h-2 w-full" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
            </div>
            <Button disabled={loading || isUploading} onClick={handleSave}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsProfile;
