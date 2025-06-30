"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Create temporary URLs for preview
        const newFiles = acceptedFiles.map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }));

        // Add to existing files
        onChange([...value, ...newFiles.map((f) => f.previewUrl)]);
      } catch (error) {
        console.error("Error handling files:", error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [value, onChange, maxFiles]
  );

  const handleRemove = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading || value.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20"
        } ${value.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drag & drop images here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WEBP (max {maxFiles} images, up to 5MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
