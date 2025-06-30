"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ImagePlus, Trash2, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export function ImageUploadField() {
  const form = useFormContext();
  const storedImageUrls = useMemo(() => form.watch("imageUrls") || [], [form]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Sync files with form state
  useEffect(() => {
    form.setValue("files", files);
  }, [form, files]);

  // Add files and previews
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length === 0) return;

      setFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  // Process dropped files
  const processFiles = useCallback((newFiles: File[]) => {
    if (newFiles.length === 0) return;

    // Filter for only image files
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((prev) => [...prev, ...imageFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  // Remove a preview and its file
  const removePreview = useCallback((index: number) => {
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // Remove a stored image URL (update form directly)
  const removeStoredImage = useCallback(
    (index: number) => {
      const updated = [...storedImageUrls];
      updated.splice(index, 1);
      form.setValue("imageUrls", updated);
    },
    [form, storedImageUrls]
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  // Preview image in modal
  const openPreview = useCallback((url: string) => {
    setPreviewImage(url);
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="space-y-4">
      <div
        ref={dropZoneRef}
        className={`p-6 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Drag and drop images here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </Button>
        </div>
        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {storedImageUrls.length + previewUrls.length} images selected
        </div>
        {(storedImageUrls.length > 0 || previewUrls.length > 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90"
            onClick={() => {
              previewUrls.forEach((url) => URL.revokeObjectURL(url));
              setPreviewUrls([]);
              setFiles([]);
              form.setValue("imageUrls", []);
            }}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {storedImageUrls.map((url: string, index: number) => (
          <div
            key={url}
            className="relative group aspect-square rounded-lg overflow-hidden border cursor-pointer"
            onClick={() => openPreview(url)}
          >
            <Image
              src={url || "/placeholder.svg"}
              alt={`Stored image ${index}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeStoredImage(index);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                openPreview(url);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {previewUrls.map((url, index) => (
          <div
            key={url}
            className="relative group aspect-square rounded-lg overflow-hidden border cursor-pointer"
            onClick={() => openPreview(url)}
          >
            <Image
              src={url || "/placeholder.svg"}
              alt={`Preview image ${index}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removePreview(index);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                openPreview(url);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {/* Visually hidden title for accessibility */}
          <DialogTitle asChild>
            <VisuallyHidden>Image Preview</VisuallyHidden>
          </DialogTitle>
          <div className="relative aspect-video w-full">
            {previewImage && (
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                fill
                className="object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
