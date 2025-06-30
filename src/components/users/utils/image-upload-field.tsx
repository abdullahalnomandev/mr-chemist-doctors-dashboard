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
  const storedLogoUrl = useMemo(() => form.watch("logoUrl") || "", [form]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    form.setValue("file", file);
  }, [form, file]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = e.target.files?.[0];
      if (!newFile) return;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(newFile);
      setPreviewUrl(URL.createObjectURL(newFile));

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [previewUrl]
  );

  const processFiles = useCallback((newFile: File) => {
    if (!newFile.type.startsWith("image/")) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
  }, [previewUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) processFiles(droppedFile);
    },
    [processFiles]
  );

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

  const openPreview = useCallback((url: string) => {
    setPreviewImage(url);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
            <p className="font-medium">Drag and drop logo here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Logo
          </Button>
        </div>
        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {(storedLogoUrl || previewUrl) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Logo selected</div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90"
            onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl("");
              setFile(null);
              form.setValue("logoUrl", "");
            }}
          >
            Clear Logo
          </Button>
        </div>
      )}

      {(storedLogoUrl || previewUrl) && (
        <div className="relative group aspect-square w-40 rounded-lg overflow-hidden border cursor-pointer">
          <Image
            src={(storedLogoUrl || previewUrl)}
            alt="Logo preview"
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
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
                setFile(null);
              }
              form.setValue("logoUrl", "");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openPreview(storedLogoUrl || previewUrl)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle asChild>
            <VisuallyHidden>Logo Preview</VisuallyHidden>
          </DialogTitle>
          <div className="relative aspect-video w-full">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Logo preview"
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
