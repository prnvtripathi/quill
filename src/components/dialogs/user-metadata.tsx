"use client";

import React, { useState, useEffect } from "react";
import { Upload, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { createClient } from "@/utils/supabase/client";

interface UserMetadataDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string | null;
}

const UserMetadataDialog = ({
  open,
  setOpen,
  userId,
}: UserMetadataDialogProps) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"url" | "file">("url");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropzoneProps = useSupabaseUpload({
    bucketName: "user-avatars",
    path: `${userId}/avatars`,
    allowedMimeTypes: ["image/*"],
    upsert: true,
    maxFileSize: 1000 * 1000 * 7, // 7MB,
    getCustomFileName: () => "profile_picture",
  });

  const fileName = dropzoneProps.files[0]?.name || null;

  const avatarUrl = fileName
    ? (dropzoneProps.publicUrls[fileName] as string) || null
    : null;

  // use debouncing for image preview
  useEffect(() => {
    const handler = setTimeout(() => {
      setImagePreview(imageUrl);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler); // Clear previous timeout
    };
  }, [imageUrl]);

  const resetForm = () => {
    setName("");
    setImageUrl("");
    setImagePreview(null);
    setActiveTab("url");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Determine which image source to use
      const finalAvatarUrl = activeTab === "url" ? imageUrl.trim() : avatarUrl;

      if (!finalAvatarUrl) {
        throw new Error(
          "Please provide a valid avatar URL or upload an image."
        );
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          avatar_url: finalAvatarUrl,
        },
      });

      if (updateError) {
        throw updateError;
      }

      await supabase.auth.refreshSession();

      toast.success("Profile updated successfully!");
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error updating user metadata:", error.message);
      toast.error("Error updating profile", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div key="dialog-body" className="p-6">
          <DialogHeader className="flex justify-between items-start">
            <DialogTitle className="text-2xl font-semibold">
              Complete Profile Details
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "url" | "file")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="image-file">Upload Image</Label>
                  <Dropzone {...dropzoneProps}>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </div>
              </TabsContent>
            </Tabs>

            {imagePreview && (
              <div className="rounded-md overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-[200px] object-cover"
                  onError={() => {
                    setImagePreview(null);
                    toast.error("Error loading image", {
                      description:
                        "The image URL could not be loaded. Please check the URL and try again.",
                    });
                  }}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !name}
                className="relative"
              >
                {isSubmitting ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  </div>
                ) : null}
                <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                  Update
                </span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserMetadataDialog;
