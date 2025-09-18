import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUp, Camera } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  onStartCamera: () => void;
}

export function FileUploader({
  onFileSelected,
  onStartCamera,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Upload Document</Label>
        <div
          className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Click to upload or drag and drop</p>
            <p className="text-xs">PDF, PNG, JPG, or JPEG up to 50MB</p>
          </div>
          <Input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onStartCamera}
          className="flex gap-2"
        >
          <Camera className="h-4 w-4" />
          Use Camera
        </Button>
      </div>
    </div>
  );
}
